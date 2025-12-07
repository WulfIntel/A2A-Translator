const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('a2aAPI', {
  pickOutputFolder: () => ipcRenderer.invoke('pick-output-folder'),
  readClipboard: () => ipcRenderer.invoke('read-clipboard'),
  generateProject: (rawText, baseDir) => ipcRenderer.invoke('generate-project', rawText, baseDir)
});
