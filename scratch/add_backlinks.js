const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/content/blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

// Map of keywords to their calculator paths
const linksMap = [
  { keyword: 'EMI Calculator', url: '/calculators/emi-calculator' },
  { keyword: 'Home Loan Calculator', url: '/calculators/home-loan-calculator' },
  { keyword: 'Flat vs Reducing', url: '/calculators/flat-vs-reducing-loan' },
  { keyword: 'FD Calculator', url: '/calculators/fd-calculator' },
  { keyword: 'FIRE Calculator', url: '/calculators/fire-calculator' },
  { keyword: 'Retirement Calculator', url: '/calculators/retirement-calculator' },
  { keyword: 'Income Tax Calculator', url: '/calculators/income-tax-calculator' },
  { keyword: 'Capital Gains Tax', url: '/calculators/capital-gains-tax' },
  { keyword: 'Lumpsum Calculator', url: '/calculators/lumpsum-calculator' },
  { keyword: 'CAGR Calculator', url: '/calculators/cagr-calculator' },
  { keyword: 'Rent vs Buy Calculator', url: '/calculators/rent-vs-buy' },
  { keyword: 'Rent vs Buy', url: '/calculators/rent-vs-buy' },
  { keyword: 'SIP vs Lumpsum Calculator', url: '/calculators/sip-vs-lumpsum' },
  { keyword: 'SIP vs Lumpsum', url: '/calculators/sip-vs-lumpsum' },
  { keyword: 'SIP Calculator', url: '/calculators/sip-calculator' },
  { keyword: 'Term Insurance Calculator', url: '/calculators/term-insurance-calculator' }
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let modified = false;

  linksMap.forEach(linkObj => {
    // Check if the exact string exists and is not already a markdown link
    // Regex explanation: Look for the keyword, ensure it is NOT preceded by '[' (which means it's already linked)
    // and NOT followed by ']'
    const regex = new RegExp(`(?<!\\[)${linkObj.keyword}(?!\\])`, 'i');
    
    // Find the first occurrence
    const match = content.match(regex);
    if (match && !content.includes(linkObj.url)) { // avoid linking if url already exists to prevent spam
      content = content.replace(regex, `[${match[0]}](${linkObj.url})`);
      modified = true;
    }
  });

  // Also add a "Related Calculator" callout at the very bottom of the article if not already there
  let relatedCalc = '';
  if (file.includes('emi')) relatedCalc = 'EMI Calculator|/calculators/emi-calculator';
  else if (file.includes('tax')) relatedCalc = 'Income Tax Calculator|/calculators/income-tax-calculator';
  else if (file.includes('sip')) relatedCalc = 'SIP Calculator|/calculators/sip-calculator';
  else if (file.includes('rent-vs-buy')) relatedCalc = 'Rent vs Buy Calculator|/calculators/rent-vs-buy';
  else if (file.includes('cagr')) relatedCalc = 'CAGR Calculator|/calculators/cagr-calculator';
  else if (file.includes('retire') || file.includes('fire')) relatedCalc = 'Retirement Calculator|/calculators/retirement-calculator';
  else if (file.includes('term')) relatedCalc = 'Term Insurance Calculator|/calculators/term-insurance-calculator';

  if (relatedCalc && !content.includes('> **Try our free')) {
    const [name, url] = relatedCalc.split('|');
    content += `\n\n> **Try our free tool:** Crunch your own numbers using the [${name}](${url}).`;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
  }
});

console.log('Successfully injected backlinks and callouts into the articles.');
