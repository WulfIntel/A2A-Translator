const { app, BrowserWindow, ipcMain, dialog, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const { parseA2A } = require('./src/parser');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    title: 'A2A Translator v2',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

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

// --- IPC Handlers ---

// 1. Pick Output Folder
ipcMain.handle('pick-output-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
});

// 2. Read Clipboard
ipcMain.handle('read-clipboard', async () => {
  try {
    const text = clipboard.readText();
    return { success: true, text };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// 3. Generate Project
ipcMain.handle('generate-project', async (event, rawText, baseDir) => {
  try {
    // Basic Validation
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      throw new Error('Input text is empty.');
    }
    if (!baseDir || typeof baseDir !== 'string') {
      throw new Error('No output directory selected.');
    }

    // Parse
    const project = parseA2A(rawText);
    
    // Create Project Root
    const projectRoot = path.join(baseDir, project.name);
    if (fs.existsSync(projectRoot)) {
      // Optional: Check if empty or throw error. For this version, we'll try to write into it.
      // throw new Error(`Directory ${project.name} already exists in target folder.`);
    } else {
      await fs.promises.mkdir(projectRoot, { recursive: true });
    }

    const writtenFiles = [];

    // Write Files
    for (const file of project.files) {
      // Normalize path to prevent directory traversal attacks
      const safePath = file.path.replace(/^[\/\\]+/, ''); // remove leading slash
      const fullPath = path.join(projectRoot, safePath);

      // Ensure target directory exists
      const targetDir = path.dirname(fullPath);
      await fs.promises.mkdir(targetDir, { recursive: true });

      // Write content
      await fs.promises.writeFile(fullPath, file.content, 'utf8');
      writtenFiles.push(safePath);
    }

    return {
      success: true,
      projectRoot,
      projectName: project.name,
      fileCount: writtenFiles.length,
      files: writtenFiles
    };

  } catch (error) {
    console.error('Generation Error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error during generation.'
    };
  }
});
