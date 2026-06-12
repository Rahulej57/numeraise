const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/content/blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

// Start date: June 1, 2026
const startDate = new Date('2026-06-01T00:00:00Z');

files.forEach((file, index) => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Spread dates between June 1 and June 11 (max 10 days)
  // We have 12 files, so maybe space them by 12-16 hours each
  const postDate = new Date(startDate.getTime() + (index * 16 * 60 * 60 * 1000));
  const dateStr = postDate.toISOString().split('T')[0];

  // Update date
  content = content.replace(/date:\s*".*"/g, `date: "${dateStr}"`);

  fs.writeFileSync(filePath, content);
});

console.log('Successfully updated blog dates to June 2026 for ' + files.length + ' files.');
