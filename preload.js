const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');

// Expose protected methods that allow the renderer process to use
// specific electron features without exposing the entire API
contextBridge.exposeInMainWorld('electron', {
  // Basic information
  isElectron: true,
  platform: process.platform,
  
  // Asset management
  getAssetPath: (assetFileName) => {
    // In development, assets are in different locations than in production
    if (process.env.NODE_ENV === 'development') {
      // For development - use the path relative to the project root
      return path.join(process.cwd(), 'src', 'assets', assetFileName);
    } else {
      // In production, the assets are typically in a resources directory
      return path.join(process.resourcesPath, 'assets', assetFileName);
    }
  },
  
  // IPC communication
  ipcRenderer: {
    send: (channel, ...args) => {
      ipcRenderer.send(channel, ...args);
    },
    on: (channel, listener) => {
      ipcRenderer.on(channel, (event, ...args) => listener(...args));
    },
    once: (channel, listener) => {
      ipcRenderer.once(channel, (event, ...args) => listener(...args));
    },
    removeListener: (channel, listener) => {
      ipcRenderer.removeListener(channel, listener);
    },
    invoke: (channel, ...args) => {
      return ipcRenderer.invoke(channel, ...args);
    }
  }
});