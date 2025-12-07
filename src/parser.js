/**
 * Parses A2A formatted text into a structured object.
 * @param {string} rawText 
 * @returns {Object} { name, type, files: [{ path, content }] }
 */
function parseA2A(rawText) {
  // Normalize line endings
  const text = rawText.replace(/\r\n/g, '\n');
  const lines = text.split('\n');

  let state = 'WAITING_HEADER'; // WAITING_HEADER, READING_METADATA, READING_FILE
  let project = {
    name: '',
    type: '',
    files: []
  };

  let currentFile = null;
  let currentContentLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Check for Header
    if (state === 'WAITING_HEADER') {
      if (trimmed === '[A2A-PROJECT]') {
        state = 'READING_METADATA';
      }
      continue;
    }

    // 2. Check for End Marker
    if (trimmed === '[END-PROJECT]') {
      // Save any open file
      if (currentFile) {
        currentFile.content = currentContentLines.join('\n');
        // Remove trailing newline if parser added one too many from join, 
        // though usually we want exact content. 
        // A2A spec says "everything... up to next line".
        // The split('\n') removes the newlines, join adds them back.
        // If the file ended with a newline in the source, it appears as an empty string in lines array.
        project.files.push(currentFile);
      }
      break; // Stop parsing
    }

    // 3. Check for File Start
    if (line.startsWith('[FILE: ') && line.endsWith(']')) {
      // Close previous file if exists
      if (currentFile) {
        currentFile.content = currentContentLines.join('\n');
        project.files.push(currentFile);
      }

      // Start new file
      const pathRaw = line.substring(7, line.length - 1).trim();
      currentFile = {
        path: pathRaw,
        content: ''
      };
      currentContentLines = [];
      state = 'READING_FILE';
      continue;
    }

    // 4. Handle Metadata (only right after header)
    if (state === 'READING_METADATA') {
      if (line.startsWith('name:')) {
        project.name = line.substring(5).trim();
        continue;
      }
      if (line.startsWith('type:')) {
        project.type = line.substring(5).trim();
        continue;
      }
      // If we hit a file definition or anything else, we are done with metadata
      if (!line.startsWith('name:') && !line.startsWith('type:') && trimmed !== '') {
        // If it's not a file block start, it's technically invalid spec or empty space, 
        // but we'll assume we transition to file reading logic or wait for file block.
        // The loop logic above handles [FILE: ...] check already.
      }
    }

    // 5. Accumulate File Content
    if (state === 'READING_FILE' && currentFile) {
      currentContentLines.push(line);
    }
  }

  // Validation
  if (!project.name) throw new Error("Missing 'name:' in project metadata.");
  if (project.files.length === 0) throw new Error("No files found in A2A input.");

  return project;
}

module.exports = { parseA2A };
