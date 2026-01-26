const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { runSystemCheck } = require('./main/systemCheck');

let mainWindow = null;
let cachedSystemCheck = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 720,
    title: 'MTN Muhasebe',
    backgroundColor: '#f6f8fb',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  cachedSystemCheck = runSystemCheck();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('system-check', () => {
  if (!cachedSystemCheck) {
    cachedSystemCheck = runSystemCheck();
  }
  return cachedSystemCheck;
});
