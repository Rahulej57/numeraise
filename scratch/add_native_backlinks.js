const fs = require('fs');
const path = require('path');

const calculatorsDir = path.join(__dirname, '../src/app/(main)/calculators');
const dynamicSeoPath = path.join(__dirname, '../src/components/calculators/dynamic-seo.tsx');

const dictionary = [
  { term: "Systematic Investment Plan", href: "/calculators/sip-calculator" },
  { term: "SIP", href: "/calculators/sip-calculator" },
  { term: "one-time investment", href: "/calculators/lumpsum-calculator" },
  { term: "Lumpsum", href: "/calculators/lumpsum-calculator" },
  { term: "lump sum", href: "/calculators/lumpsum-calculator" },
  { term: "Equated Monthly Installment", href: "/calculators/emi-calculator" },
  { term: "EMI", href: "/calculators/emi-calculator" },
  { term: "home loan", href: "/calculators/home-loan-calculator" },
  { term: "housing loan", href: "/calculators/home-loan-calculator" },
  { term: "mortgage", href: "/calculators/home-loan-calculator" },
  { term: "Flat Rate", href: "/calculators/flat-vs-reducing-loan" },
  { term: "Reducing Balance", href: "/calculators/flat-vs-reducing-loan" },
  { term: "diminishing balance", href: "/calculators/flat-vs-reducing-loan" },
  { term: "Term Insurance", href: "/calculators/term-insurance-calculator" },
  { term: "life cover", href: "/calculators/term-insurance-calculator" },
  { term: "death benefit", href: "/calculators/term-insurance-calculator" },
  { term: "Health Insurance", href: "/calculators/health-insurance-calculator" },
  { term: "medical cover", href: "/calculators/health-insurance-calculator" },
  { term: "Net Worth", href: "/calculators/net-worth-calculator" },
  { term: "assets and liabilities", href: "/calculators/net-worth-calculator" },
  { term: "compound annual growth rate", href: "/calculators/cagr-calculator" },
  { term: "CAGR", href: "/calculators/cagr-calculator" },
  { term: "purchasing power", href: "/calculators/inflation-calculator" },
  { term: "Inflation", href: "/calculators/inflation-calculator" },
  { term: "Public Provident Fund", href: "/calculators/ppf-calculator" },
  { term: "PPF", href: "/calculators/ppf-calculator" },
  { term: "Employee Provident Fund", href: "/calculators/epf-calculator" },
  { term: "EPF", href: "/calculators/epf-calculator" },
  { term: "National Pension System", href: "/calculators/nps-calculator" },
  { term: "NPS", href: "/calculators/nps-calculator" },
  { term: "Fixed Deposit", href: "/calculators/fd-calculator" },
  { term: "FD", href: "/calculators/fd-calculator" },
  { term: "Recurring Deposit", href: "/calculators/rd-calculator" },
  { term: "RD", href: "/calculators/rd-calculator" },
  { term: "Mutual Fund", href: "/calculators/mutual-fund-returns" },
  { term: "mutual funds", href: "/calculators/mutual-fund-returns" },
  { term: "Return on Investment", href: "/calculators/roi-calculator" },
  { term: "ROI", href: "/calculators/roi-calculator" },
  { term: "Car Loan", href: "/calculators/car-loan-emi" },
  { term: "auto loan", href: "/calculators/car-loan-emi" },
  { term: "Personal Loan", href: "/calculators/personal-loan-calculator" },
  { term: "Credit Card", href: "/calculators/credit-card-payoff" },
  { term: "credit card debt", href: "/calculators/credit-card-payoff" },
  { term: "Income Tax", href: "/calculators/income-tax-calculator" },
  { term: "tax liability", href: "/calculators/income-tax-calculator" },
  { term: "Goods and Services Tax", href: "/calculators/gst-calculator" },
  { term: "GST", href: "/calculators/gst-calculator" },
  { term: "Financial Independence", href: "/calculators/fire-calculator" },
  { term: "Retire Early", href: "/calculators/fire-calculator" },
  { term: "FIRE", href: "/calculators/fire-calculator" },
  { term: "retirement corpus", href: "/calculators/retirement-calculator" },
  { term: "Retirement", href: "/calculators/retirement-calculator" },
  { term: "Human Life Value", href: "/calculators/human-life-value" }
];

// Sort dictionary by length descending so "Systematic Investment Plan" is matched before "SIP"
dictionary.sort((a, b) => b.term.length - a.term.length);

function processContent(content, currentSlug) {
  let linkedHrefs = new Set();
  let totalLinks = 0;
  const maxLinks = 4; // Max 4 native links per file

  // We want to replace text inside <p> or <li> tags, ignoring anything inside <a> or <Link>
  // A safe way is to split by `<p>`/`</p>`, `<li>`/`</li>` and only process the inner text.
  // Actually, even safer: use a replacer that only runs on text segments.
  
  // We'll process block by block using regex to find <p>...</p> and <li>...</li>
  const blockRegex = /(<(p|li)[^>]*>)([\s\S]*?)(<\/\2>)/gi;

  let newContent = content.replace(blockRegex, (match, openTag, tagName, innerText, closeTag) => {
    if (totalLinks >= maxLinks) return match; // Reached limit

    let newInnerText = innerText;
    
    // For each dictionary term, if it exists in the innerText and we haven't linked it yet
    for (const entry of dictionary) {
      if (totalLinks >= maxLinks) break;

      // Don't link to the page we are currently on
      if (currentSlug && entry.href.includes(currentSlug)) continue;
      
      // Don't link if we already linked to this calculator in this file
      if (linkedHrefs.has(entry.href)) continue;

      // We only want to link if the word isn't already inside an <a> tag
      // Since innerText might have <a> tags, we split by <a>...</a> and only replace in the outside parts
      const aTagRegex = /(<a\s[^>]*>[\s\S]*?<\/a>|<Link\s[^>]*>[\s\S]*?<\/Link>|<[^>]+>)/gi;
      
      let parts = newInnerText.split(aTagRegex);
      let termInjected = false;

      for (let i = 0; i < parts.length; i++) {
        // Even indices are plain text, odd indices are HTML tags
        if (i % 2 === 0 && !termInjected) {
          // Case-insensitive, whole word match
          const termRegex = new RegExp(`(?<=\\b|\\s|^)(${entry.term})(?=\\b|\\s|[.,!?;:]|$)`, 'i');
          const matchTerm = parts[i].match(termRegex);
          
          if (matchTerm) {
            // Found a match! Let's wrap it in a Link tag. 
            // The Next.js standard is <Link href="..." className="...">...</Link>
            // We use standard <a> tags here because dynamic-seo.tsx doesn't have next/link imported in every block
            // and regular <a> tags work perfectly with Tailwind's prose-a anyway
            parts[i] = parts[i].replace(
              termRegex, 
              `<a href="${entry.href}">$1</a>`
            );
            linkedHrefs.add(entry.href);
            totalLinks++;
            termInjected = true;
          }
        }
      }
      
      if (termInjected) {
        newInnerText = parts.join('');
      }
    }
    
    return openTag + newInnerText + closeTag;
  });

  return newContent;
}

// 1. Process dynamic-seo.tsx
if (fs.existsSync(dynamicSeoPath)) {
  let content = fs.readFileSync(dynamicSeoPath, 'utf-8');
  
  // dynamic-seo.tsx has multiple blocks: if (slug === '...')
  // We can process it by splitting by `if (slug === ` and then parsing each block
  let blocks = content.split(/if\s*\(slug\s*===\s*['"]/);
  for (let i = 1; i < blocks.length; i++) {
    // The slug is the first word until the closing quote
    const slugMatch = blocks[i].match(/^([^'"]+)['"]/);
    if (slugMatch) {
      const slug = slugMatch[1];
      blocks[i] = processContent(blocks[i], slug);
    }
  }
  
  let newContent = blocks.join("if (slug === '");
  fs.writeFileSync(dynamicSeoPath, newContent, 'utf-8');
  console.log(`Processed dynamic-seo.tsx`);
}

// 2. Process all custom page.tsx files
const dirs = fs.readdirSync(calculatorsDir);
for (const dir of dirs) {
  const stat = fs.statSync(path.join(calculatorsDir, dir));
  if (stat.isDirectory() && dir !== '[slug]' && dir !== 'category') {
    const pagePath = path.join(calculatorsDir, dir, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      let content = fs.readFileSync(pagePath, 'utf-8');
      const newContent = processContent(content, dir);
      if (content !== newContent) {
        fs.writeFileSync(pagePath, newContent, 'utf-8');
        console.log(`Processed ${dir}/page.tsx`);
      }
    }
  }
}

console.log('Native inline backlinks injection complete.');
