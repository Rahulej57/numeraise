const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../src/content/blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

// Sort files to have a consistent order
files.sort();

// Start date: April 25, 2026. Stagger by 4 days each.
let currentDate = new Date('2026-04-25T10:00:00Z');

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Format date as YYYY-MM-DD
  const dateString = currentDate.toISOString().split('T')[0];
  
  // Replace date
  content = content.replace(/date:\s*".*?"/, `date: "${dateString}"`);
  
  // Replace author
  content = content.replace(/author:\s*".*?"/, `author: "Rahul Sharma, CFA"`);

  fs.writeFileSync(filePath, content, 'utf8');
  
  // Add 4 days for the next post
  currentDate.setDate(currentDate.getDate() + 4);
});

console.log('Successfully staggered 12 blog posts from April 25 to June 8!');
