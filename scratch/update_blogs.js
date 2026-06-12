const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/content/blog');

function updateFile(filename, replacements) {
  const filePath = path.join(dir, filename);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  replacements.forEach(([search, replace]) => {
    content = content.replace(new RegExp(search, 'g'), replace);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filename}`);
  }
}

// Blog 1: SIP vs Lumpsum
updateFile('sip-vs-lumpsum-which-builds-more-wealth.md', [
  ['12%', '`RATE:EQUITY`%']
]);

// Blog 2: Power of compounding
updateFile('power-of-compounding-starting-age-matters.md', [
  ['12%', '`RATE:EQUITY`%']
]);

// Blog 3: Rent vs Buy
updateFile('rent-vs-buy-the-ultimate-financial-decision.md', [
  ['8.5%', '`RATE:HOMELOAN`%'],
  ['12%', '`RATE:EQUITY`%']
]);

console.log('Blog update complete.');
