# A2A Translator
A2A Translator is a Windows desktop application that converts A2A Spec text into complete, real, multi-file project structures. It is the official compiler for the A2A (AI-to-App) ecosystem, enabling deterministic, reproducible, AI-generated software projects from plain text.

The Translator reads structured A2A project definitions and generates:
- A root project folder
- All directories required by the specification
- All files defined in the [FILE: path] blocks
- Exact file contents with no alterations
- A full project ready to run, open, or build

This tool guarantees that an AI can reliably produce a real, multi-file application with zero ambiguity.

## Why A2A Translator Exists
LLMs are powerful but inconsistent when generating multi-file code. Paths break, files merge, formats drift, and results become unpredictable.

A2A solves this by:
1. Defining a deterministic project language (A2A Spec)
2. Teaching AIs to output projects in that format
3. Using A2A Translator to build those projects exactly as described

The Translator turns AI output into real software, reliably and repeatedly.

## Key Features
- Convert A2A project text into a full filesystem project
- Create folders and nested directories automatically
- Generate each file exactly as defined in the spec
- Paste directly from clipboard
- Full status log during generation
- Clean Electron UI (dark theme, VS Code-like styling)
- Safe path normalization to prevent directory traversal attacks
- 100% offline, privacy-first

## User Installation (Normal Users)
1. Download the latest installer (.exe) from the Releases page of this repository.
2. Run the installer.
3. Launch A2A Translator from the Start Menu or Desktop shortcut.
4. Paste A2A text, choose an output folder, and click Generate Project.

## Developer Setup (Run from Source)
Requirements:
- Node.js
- npm
- Git

Steps:
1. Clone the repository:
   git clone https://github.com/WulfIntel/A2A-Translator.git
2. Install dependencies:
   npm install
3. Start the app:
   npm start

## Building a Windows Installer (.exe)
1. Install dependencies:
   npm install
2. Build:
   npm run build
The distributable files will appear under /dist or /out depending on configuration.

## Internal Architecture
### Main Process
Handles:
- Window creation
- Dialogs
- Clipboard actions
- Project generation

### Preload Script
Exposes safe APIs to the renderer through Electron’s contextBridge.

### Renderer
Controls UI: buttons, text input, logs, folder selection.

### A2A Parser
Reads A2A text and extracts metadata, file definitions, and validation rules.

## Example Workflow
1. Generate A2A text using an AI model.
2. Paste into A2A Translator.
3. Pick an output folder.
4. Click Generate Project.
5. A full project appears immediately.

## Benefits
- Reliable multi-file project generation
- Predictable behavior for AI workflows
- Fully offline and privacy-first
- Great for developers, AI agents, and automation pipelines

## License
MIT License. See the LICENSE file for details.
