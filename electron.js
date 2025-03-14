const { app, BrowserWindow, protocol, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');
const fs = require('fs');

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;
let pythonProcess = null;

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

function startPythonBackend() {
  // Path to the Python executable and script
  const pythonExecutable = isDev ? 'python' : path.join(process.resourcesPath, 'backend', 'python', 'python.exe');
  const scriptPath = isDev 
    ? path.join(__dirname, 'backend', 'serverdbc.py') 
    : path.join(process.resourcesPath, 'backend', 'serverdbc.py');
  
  // Check if the script exists
  if (!fs.existsSync(scriptPath)) {
    console.error(`Python script not found at: ${scriptPath}`);
    dialog.showErrorBox(
      'Backend Error',
      `Could not find the backend script at: ${scriptPath}`
    );
    return null;
  }
  
  console.log(`Starting Python backend: ${pythonExecutable} ${scriptPath}`);
  
  // Launch the Python process
  const process = spawn(pythonExecutable, [scriptPath], {
    stdio: 'pipe'
  });
  
  // Log stdout and stderr
  process.stdout.on('data', (data) => {
    console.log(`Python Backend: ${data}`);
  });
  
  process.stderr.on('data', (data) => {
    console.error(`Python Backend Error: ${data}`);
  });
  
  process.on('close', (code) => {
    console.log(`Python backend process exited with code ${code}`);
    pythonProcess = null;
  });
  
  return process;
}

function createWindow() {
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
    // Uncomment these for production
    fullscreen: true,
    // kiosk: true,
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
app.whenReady().then(() => {
  // Start the Python backend first
  pythonProcess = startPythonBackend();
  
  // Wait a bit for the backend to initialize, then create window
  setTimeout(() => {
    createWindow();
    
    // Explicitly activate the app to ensure it comes to foreground
    if (process.platform !== 'darwin') {
      app.focus({ steal: true });
    }
  }, 1000);
});

// Quit when all windows are closed, except on macOS
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
      // On Windows we need to kill the process group
      try {
        spawn('taskkill', ['/pid', pythonProcess.pid, '/f', '/t']);
      } catch (error) {
        console.error('Error terminating Python backend:', error);
      }
    } else {
      // On Unix-like systems we can just kill the process
      pythonProcess.kill();
    }
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
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