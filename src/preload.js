const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getSystemCheck: () => ipcRenderer.invoke('system-check')
});
