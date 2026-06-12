const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/content/blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

// Start date: 60 days ago
const startDate = new Date();
startDate.setDate(startDate.getDate() - 60);

files.forEach((file, index) => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Randomize date based on index to ensure spread within last 60 days
  const postDate = new Date(startDate.getTime() + (index * 5 * 24 * 60 * 60 * 1000));
  const dateStr = postDate.toISOString().split('T')[0];

  // Revert author
  content = content.replace(/author:\s*".*"/g, `author: "Numeraise Team"`);
  
  // Update date
  content = content.replace(/date:\s*".*"/g, `date: "${dateStr}"`);

  fs.writeFileSync(filePath, content);
});

console.log('Successfully updated blog metadata for ' + files.length + ' files.');
