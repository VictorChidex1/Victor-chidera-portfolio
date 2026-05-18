const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Remove unused React imports
    content = content.replace(/import React from ["']react["'];\n?/g, '');
    content = content.replace(/import React,\s*\{\s*([^}]+)\s*\}\s*from ["']react["'];/g, 'import { $1 } from "react";');

    // Fix ease array
    content = content.replace(/ease:\s*\[([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\]/g, 'ease: [$1, $2, $3, $4] as const');
    
    // Fix string ease
    content = content.replace(/ease:\s*["'](ease[a-zA-Z]+)["']/g, 'ease: "$1" as const');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
    }
  }
});
