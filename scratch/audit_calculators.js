const fs = require('fs');
const path = require('path');

// Read the config file as a string
const configPath = path.join(__dirname, '../src/config/calculators.tsx');
const configContent = fs.readFileSync(configPath, 'utf8');

// Extract all hrefs using regex
const hrefMatches = [...configContent.matchAll(/href:\s*['"]\/calculators\/([^'"]+)['"]/g)];
const allCalculators = hrefMatches.map(match => match[1]);

// Count total
const totalCalculators = new Set(allCalculators);
console.log(`Total Calculators in Config: ${totalCalculators.size}`);

// Find separated calculators
const calculatorsDir = path.join(__dirname, '../src/app/(main)/calculators');
const separatedFolders = fs.readdirSync(calculatorsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== '[slug]' && dirent.name !== 'category')
  .map(dirent => dirent.name);

console.log(`Separated Folders: ${separatedFolders.length}`);

// Find missing ones
const separatedSet = new Set(separatedFolders);
const missing = [...totalCalculators].filter(calc => !separatedSet.has(calc));

console.log(`Calculators needing separation (${missing.length}):`);
missing.forEach(calc => console.log(`- ${calc}`));
