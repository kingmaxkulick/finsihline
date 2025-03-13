const { app, BrowserWindow, protocol, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;
let pythonProcess = null;
let isDev = null;

// Set up protocol handler to allow bringing app to foreground
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('vehicle-dashboard', process.execPath, [
      path.resolve(process.argv[1])
    ]);
  }
} else {
  app.setAsDefaultProtocolClient('vehicle-dashboard');
}

// Handle second instance (prevent multiple instances and bring app to front)
app.on('second-instance', (event, commandLine) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

// Load isDev dynamically
async function loadDependencies() {
  try {
    const electronIsDev = await import('electron-is-dev');
    isDev = electronIsDev.default;
    console.log('Successfully loaded electron-is-dev:', isDev);
    return true;
  } catch (error) {
    console.error('Error loading electron-is-dev:', error);
    // Fallback to manually determine development mode
    isDev = !app.isPackaged;
    console.log('Falling back to manual isDev check:', isDev);
    return false;
  }
}

// Simplified Python backend function that uses system Python
function startPythonBackend(isDev, resourcesPath) {
  // Use system Python - it's known to be installed
  const pythonExecutable = 'python';
  
  // For script path, we need to find where it's located
  let scriptPath;
  
  if (isDev) {
    scriptPath = path.join(__dirname, 'backend', 'simple_backend.py');
  } else {
    // In packaged app, the backend should be in resources
    scriptPath = path.join(resourcesPath, 'backend', 'simple_backend.py');
    
    // Log the attempted path to help with debugging
    console.log('Looking for Python script at:', scriptPath);
    
    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
      console.error('Python script not found at:', scriptPath);
      // Try alternative locations
      const altPaths = [
        path.join(app.getAppPath(), 'backend', 'simple_backend.py'),
        path.join(app.getPath('exe'), '..', 'backend', 'simple_backend.py'),
        path.join(resourcesPath, '..', 'backend', 'simple_backend.py')
      ];
      
      for (const altPath of altPaths) {
        console.log('Trying alternative path:', altPath);
        if (fs.existsSync(altPath)) {
          scriptPath = altPath;
          console.log('Found script at:', scriptPath);
          break;
        }
      }
      
      if (!fs.existsSync(scriptPath)) {
        console.error('Could not find Python script in any location');
        return null;
      }
    }
  }
  
  console.log(`Starting Python backend: ${pythonExecutable} ${scriptPath}`);
  
  try {
    // Launch Python using system Python
    const pythonProc = spawn(pythonExecutable, [scriptPath], {
      stdio: 'pipe'
    });
    
    // Log output
    pythonProc.stdout.on('data', (data) => {
      console.log(`Python Backend: ${data}`);
    });
    
    pythonProc.stderr.on('data', (data) => {
      console.error(`Python Backend Error: ${data}`);
    });
    
    pythonProc.on('close', (code) => {
      console.log(`Python backend process exited with code ${code}`);
      pythonProcess = null;
    });
    
    return pythonProc;
  } catch (error) {
    console.error('Failed to start Python process:', error);
    return null;
  }
}

function createWindow(isDev) {
  // Enable GPU acceleration
  app.commandLine.appendSwitch('ignore-gpu-blacklist');
  app.commandLine.appendSwitch('enable-gpu-rasterization');
  
  // Register the file protocol handler to allow accessing local files
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  });

  // Get the primary display dimensions
  const primaryDisplay = require('electron').screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    fullscreen: true,
    show: false, // Initially hidden to prevent white flash
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // This is required to allow loading local video files
    }
  });

  // Show window only when ready to show (prevents white flashing)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus(); // Make sure window gets focus
  });

  // Load your React app
  const startUrl = isDev
    ? 'http://localhost:5174' // Updated to match Vite's port
    : `file://${path.join(__dirname, './dist/index.html')}`; // Production build path
  
  console.log(`Loading URL: ${startUrl}`);
  mainWindow.loadURL(startUrl);
  
  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(async () => {
  // Load dependencies first
  await loadDependencies();
  
  // Determine resources path safely
  const resourcesPath = app.isPackaged 
    ? path.join(app.getAppPath(), '..', 'resources')
    : __dirname;
  
  console.log('App is packaged:', app.isPackaged);
  console.log('Resource path:', resourcesPath);
  console.log('App path:', app.getAppPath());
  console.log('Exe path:', app.getPath('exe'));
  
  // Start the Python backend
  pythonProcess = startPythonBackend(isDev, resourcesPath);
  
  // Wait for vehicle systems to initialize
  // Increased from 1000ms to 5000ms (5 seconds)
  console.log('Waiting 5 seconds for vehicle systems to initialize...');
  
  setTimeout(() => {
    createWindow(isDev);
    
    // Explicitly activate the app and bring to foreground
    if (process.platform !== 'darwin') {
      app.focus({ steal: true });
    }
  }, 5000); // 5 second delay before creating window
});

// Rest of your code remains the same
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up the Python process when the app is quitting
app.on('quit', () => {
  if (pythonProcess) {
    console.log('Terminating Python backend process...');
    if (process.platform === 'win32') {
      try {
        spawn('taskkill', ['/pid', pythonProcess.pid, '/f', '/t']);
      } catch (error) {
        console.error('Error terminating Python backend:', error);
      }
    } else {
      pythonProcess.kill();
    }
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow(isDev);
  }
});

// Exit kiosk mode with ESC key (for development and testing)
app.on('browser-window-created', (_, window) => {
  window.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      if (window.isFullScreen()) {
        window.setFullScreen(false);
      } else if (window.isKiosk()) {
        window.setKiosk(false);
      }
    }
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});