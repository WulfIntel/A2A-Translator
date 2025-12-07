# A2A Translator
Desktop tool for converting A2A Spec text into complete, multi-file software projects.

## Overview
The A2A Translator is the official compiler of the A2A ecosystem. It takes A2A-formatted text produced by an AI model and converts it into a real project directory structure with real files. This ensures deterministic, zero-ambiguity AI-to-App generation: the AI writes the A2A project description, and the Translator generates the runnable project exactly as specified.

## Features
- Parses full A2A project documents
- Automatically creates directory structures
- Generates all files exactly as defined in [FILE: path] blocks
- Displays warnings for malformed or incomplete A2A text
- Windows-native desktop application powered by Electron
- Fully offline for privacy and security

## What is A2A?
A2A (AI-to-App) is a deterministic plain-text project format that describes complete multi-file software projects. The Translator reads the specification and constructs the final codebase on disk. Every project includes a header, metadata section, file blocks, and a terminating end block. The Translator guarantees that the output always matches the specification.

## Installation
### Download Release Build
Get the latest Windows installer from the Releases page of this repository.

### Install
Run the installer and complete the setup process.

### Use the Translator
1. Open the application
2. Paste your A2A project text into the input panel
3. Select an output folder
4. Click Generate Project
Your full codebase will appear in the selected folder.

## Development Setup
Clone the repository locally, then run:
npm install
npm start

To build a distributable version:
npm run build

## Workflow Summary
1. Generate A2A project text using an AI model trained on the A2A Spec
2. Paste the A2A text into the Translator
3. Choose an output directory
4. Generate the full project
5. Open the generated files in your preferred editor

## Part of the A2A Ecosystem
- A2A Spec: The deterministic DSL for AI-generated multi-file software
- A2A Inspector: Validates A2A project structure before translation
- A2A Translator: Converts A2A text into real project files

## License
This project is open source under the MIT License.
