const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/calculators/dynamic-seo.tsx');
let lines = fs.readFileSync(filePath, 'utf-8').split('\n');

const links = [
  { term: 'SIP', href: '/calculators/sip-calculator' },
  { term: 'Lumpsum', href: '/calculators/lumpsum-calculator' },
  { term: 'Fixed Deposit', href: '/calculators/fd-calculator' },
  { term: 'Recurring Deposit', href: '/calculators/rd-calculator' },
  { term: 'Term Insurance', href: '/calculators/term-insurance-calculator' },
  { term: 'Health Insurance', href: '/calculators/health-insurance-calculator' },
  { term: 'Home Loan', href: '/calculators/home-loan-calculator' },
  { term: 'EMI', href: '/calculators/emi-calculator' },
  { term: 'Mutual Fund', href: '/calculators/mutual-fund-returns' },
  { term: 'Inflation', href: '/calculators/inflation-calculator' },
  { term: 'PPF', href: '/calculators/ppf-calculator' },
  { term: 'EPF', href: '/calculators/epf-calculator' },
  { term: 'NPS', href: '/calculators/nps-calculator' },
  { term: 'CAGR', href: '/calculators/cagr-calculator' }
];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // Only process lines that have <p> or <li> tags (which are the main text blocks in dynamic-seo.tsx)
  // This guarantees we don't mess with JSON strings in the FAQ array or JS logic.
  if (line.includes('<p>') || line.includes('<li>')) {
    
    links.forEach(({ term, href }) => {
      // Regex to match term not inside attributes.
      // (?<=[>\\s]) matches a space or ">" before the term
      // (?=[\\s.,!?:;<]) matches a space, punctuation, or "<" after the term
      const regex = new RegExp(`(?<=[>\\s])(${term})(?=[\\s.,!?:;<])`, 'g');
      
      line = line.replace(regex, (match, p1, offset, string) => {
        // Simple check to ensure we aren't already inside an <a> tag
        const before = string.substring(0, offset);
        const lastOpenA = before.lastIndexOf('<a ');
        const lastCloseA = before.lastIndexOf('</a');
        if (lastOpenA > lastCloseA) {
          return match;
        }
        return `<a href="${href}">${match}</a>`;
      });
    });
    
    lines[i] = line;
  }
}

// Write the lines back to the file
fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
console.log('Successfully injected safe backlinks.');
