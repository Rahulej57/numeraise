const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/content/blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

// Start date: 6 months ago
const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 6);

files.forEach((file, index) => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Randomize date based on index to ensure spread
  const postDate = new Date(startDate.getTime() + (index * 15 * 24 * 60 * 60 * 1000));
  const dateStr = postDate.toISOString().split('T')[0];

  // Update author
  content = content.replace(/author:\s*".*"/g, `author: "Rahul Desai"`);
  
  // Update date
  content = content.replace(/date:\s*".*"/g, `date: "${dateStr}"`);

  // Simple internal linking injection: replace "SIP" with a link occasionally, or "calculators"
  if (!content.includes('](/calculators')) {
    if (content.includes('SIP ')) {
      content = content.replace('SIP ', '[SIP](/calculators/sip-calculator) ');
    } else if (content.includes('calculator')) {
      content = content.replace('calculator', '[calculator](/financial-calculators)');
    }
  }

  // Make titles punchier (just a quick replace if it's the exact old title)
  if (file === 'old-vs-new-tax-regime-comparison.md') {
    content = content.replace(/title:\s*".*"/, `title: "Old vs New Tax Regime 2026: Which Saves More for Your Income?"`);
  }

  fs.writeFileSync(filePath, content);
});

console.log('Successfully updated blog metadata for ' + files.length + ' files.');
