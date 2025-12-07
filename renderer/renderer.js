// DOM Elements
const btnSelectFolder = document.getElementById('btn-select-folder');
const inputPath = document.getElementById('output-path');
const inputText = document.getElementById('input-text');
const btnPaste = document.getElementById('btn-paste');
const btnClear = document.getElementById('btn-clear');
const btnGenerate = document.getElementById('btn-generate');
const logContainer = document.getElementById('log-container');

// State
let selectedPath = null;

// Logger
function log(message, type = 'info') {
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString();
  entry.textContent = `[${time}] ${message}`;
  logContainer.appendChild(entry);
  logContainer.scrollTop = logContainer.scrollHeight;
}

function clearLog() {
  logContainer.innerHTML = '';
}

function updateGenerateButton() {
  const hasText = inputText.value.trim().length > 0;
  const hasPath = !!selectedPath;
  btnGenerate.disabled = !(hasText && hasPath);
}

// Event Listeners

// 1. Select Folder
btnSelectFolder.addEventListener('click', async () => {
  const path = await window.a2aAPI.pickOutputFolder();
  if (path) {
    selectedPath = path;
    inputPath.value = path;
    log(`Output folder selected: ${path}`, 'success');
    updateGenerateButton();
  } else {
    log('Folder selection canceled.', 'warning');
  }
});

// 2. Paste
btnPaste.addEventListener('click', async () => {
  const result = await window.a2aAPI.readClipboard();
  if (result.success) {
    inputText.value = result.text;
    log('Content pasted from clipboard.', 'info');
    updateGenerateButton();
  } else {
    log(`Paste failed: ${result.error}`, 'error');
  }
});

// 3. Clear
btnClear.addEventListener('click', () => {
  inputText.value = '';
  clearLog();
  log('Workspace cleared.', 'info');
  updateGenerateButton();
});

// 4. Input Change
inputText.addEventListener('input', updateGenerateButton);

// 5. Generate
btnGenerate.addEventListener('click', async () => {
  const rawText = inputText.value;
  
  if (!selectedPath) {
    log('Error: No output folder selected.', 'error');
    return;
  }

  log('Starting generation...', 'info');
  btnGenerate.disabled = true;
  btnGenerate.textContent = 'Processing...';

  try {
    const result = await window.a2aAPI.generateProject(rawText, selectedPath);

    if (result.success) {
      log(`SUCCESS: Project "${result.projectName}" created.`, 'success');
      log(`Location: ${result.projectRoot}`, 'success');
      log(`Files written: ${result.fileCount}`, 'success');
      
      // List files
      result.files.forEach(f => {
        log(`  + ${f}`, 'info');
      });
    } else {
      log(`FAILURE: ${result.error}`, 'error');
    }
  } catch (err) {
    log(`Unexpected Error: ${err.message}`, 'error');
  } finally {
    btnGenerate.disabled = false;
    btnGenerate.textContent = 'Generate Project';
    updateGenerateButton();
  }
});

// Init
log('A2A Translator v2 initialized. Select a folder and paste A2A text to begin.');
