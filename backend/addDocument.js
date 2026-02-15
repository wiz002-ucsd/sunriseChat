#!/usr/bin/env node
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { addDocument } = require('./services/ragService');

async function main() {
  const args = process.argv.slice(2);

  // Parse --title and --file flags
  let title = null;
  let filePath = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--title' && args[i + 1]) {
      title = args[i + 1];
      i++;
    } else if (args[i] === '--file' && args[i + 1]) {
      filePath = args[i + 1];
      i++;
    }
  }

  if (!title || !filePath) {
    console.error('Usage: node addDocument.js --title "Document Title" --file ./path/to/file.txt');
    process.exit(1);
  }

  // Resolve file path
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(resolvedPath, 'utf-8');
  if (content.trim().length < 50) {
    console.error('File content is too short (minimum 50 characters).');
    process.exit(1);
  }

  console.log(`Adding document: "${title}"`);
  console.log(`File: ${resolvedPath} (${content.length} characters)`);

  const result = await addDocument(title, content, {
    source: path.basename(resolvedPath),
  });

  console.log(`Done! Document ID: ${result.documentId}, Chunks: ${result.chunks}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
