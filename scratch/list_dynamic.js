const fs = require('fs');
const path = require('path');

const calculatorsDir = path.join(__dirname, '../src/app/(main)/calculators');
const folders = fs.readdirSync(calculatorsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== '[slug]' && dirent.name !== 'category')
  .map(dirent => dirent.name);

console.log('Custom Calculator Folders (' + folders.length + '):');
console.log(folders.join(', '));
