import fs from 'fs';
import path from 'path';

const publicBlogDir = path.join(process.cwd(), 'public/blog');
const contentBlogDir = path.join(process.cwd(), 'src/content/blog');

if (!fs.existsSync(contentBlogDir)) {
  fs.mkdirSync(contentBlogDir, { recursive: true });
}

const htmlFiles = fs.readdirSync(publicBlogDir).filter(file => file.endsWith('.html') && file !== 'index.html');

htmlFiles.forEach(file => {
  const filePath = path.join(publicBlogDir, file);
  const htmlContent = fs.readFileSync(filePath, 'utf8');

  // Extract title
  const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/);
  let title = titleMatch ? titleMatch[1].replace(' - Numeraise', '') : '';
  
  // Try to find the h1 for title if not found or cleaner
  const h1Match = htmlContent.match(/<h1>([^<]+)<\/h1>/);
  if (h1Match) {
    title = h1Match[1];
  }

  // Extract author and date
  // e.g. <p><em>June 7, 2026 • By Numeraise Loan Experts</em></p>
  const metaMatch = htmlContent.match(/<em>([^•]+)•\s*(?:By\s*)?([^<]+)<\/em>/);
  let date = '2026-06-07';
  let author = 'Numeraise Team';
  if (metaMatch) {
    const rawDate = metaMatch[1].trim();
    author = metaMatch[2].trim();
    // Convert June 7, 2026 to YYYY-MM-DD
    try {
      const parsedDate = new Date(rawDate);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString().split('T')[0];
      }
    } catch (e) {
      console.error('Error parsing date:', rawDate);
    }
  }

  // Extract main content
  const mainMatch = htmlContent.match(/<main>([\s\S]*?)<\/main>/);
  if (!mainMatch) {
    console.error(`Could not find <main> in ${file}`);
    return;
  }

  let mainHtml = mainMatch[1];

  // Remove the H1 and its meta subtitle from mainHtml so it doesn't double-render
  mainHtml = mainHtml.replace(/<h1>[\s\S]*?<\/h1>/, '');
  mainHtml = mainHtml.replace(/<p>\s*<em[\s\S]*?<\/em>\s*<\/p>/, '');

  let markdown = mainHtml;

  // Convert headings
  markdown = markdown.replace(/<h2>([\s\S]*?)<\/h2>/g, '\n## $1\n');
  markdown = markdown.replace(/<h3>([\s\S]*?)<\/h3>/g, '\n### $1\n');

  // Convert links
  markdown = markdown.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)');

  // Convert strong/em
  markdown = markdown.replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**');
  markdown = markdown.replace(/<b>([\s\S]*?)<\/b>/g, '**$1**');
  markdown = markdown.replace(/<em>([\s\S]*?)<\/em>/g, '*$1*');
  markdown = markdown.replace(/<i>([\s\S]*?)<\/i>/g, '*$1*');

  // Convert lists
  markdown = markdown.replace(/<ul>([\s\S]*?)<\/ul>/g, (match, listContent) => {
    return '\n' + listContent.replace(/<li>([\s\S]*?)<\/li>/g, '- $1').trim() + '\n';
  });

  // Convert mistakes divs to callouts
  markdown = markdown.replace(/<div\s+class="mistake">([\s\S]*?)<\/div>/g, (match, inner) => {
    const lines = inner.trim().split('\n').map(line => `> ${line.trim()}`);
    return '\n' + lines.join('\n') + '\n';
  });

  // Convert related divs to callouts
  markdown = markdown.replace(/<div\s+class="related">([\s\S]*?)<\/div>/g, (match, inner) => {
    const lines = inner.trim().split('\n').map(line => `> ${line.trim()}`);
    return '\n' + lines.join('\n') + '\n';
  });

  // Convert tables
  markdown = markdown.replace(/<table>([\s\S]*?)<\/table>/g, (match, tableContent) => {
    let mdTable = '\n';
    
    // Parse headers
    const theadMatch = tableContent.match(/<thead>([\s\S]*?)<\/thead>/);
    let headersCount = 0;
    if (theadMatch) {
      const trs = theadMatch[1].match(/<tr>([\s\S]*?)<\/tr>/g) || [theadMatch[1]];
      trs.forEach(tr => {
        const ths = tr.match(/<th>([\s\S]*?)<\/th>/g) || [];
        headersCount = ths.length;
        const thTexts = ths.map(th => th.replace(/<\/?th>/g, '').trim());
        mdTable += '| ' + thTexts.join(' | ') + ' |\n';
      });
    }

    if (headersCount > 0) {
      mdTable += '| ' + Array(headersCount).fill('---').join(' | ') + ' |\n';
    }

    // Parse body
    const tbodyMatch = tableContent.match(/<tbody>([\s\S]*?)<\/tbody>/) || [tableContent];
    const trs = tbodyMatch[0].match(/<tr>([\s\S]*?)<\/tr>/g) || [];
    trs.forEach(tr => {
      const tds = tr.match(/<td>([\s\S]*?)<\/td>/g) || [];
      const tdTexts = tds.map(td => td.replace(/<\/?td>/g, '').trim());
      mdTable += '| ' + tdTexts.join(' | ') + ' |\n';
    });

    return mdTable + '\n';
  });

  // Clean paragraphs and other tags
  markdown = markdown.replace(/<p>([\s\S]*?)<\/p>/g, '\n$1\n');
  markdown = markdown.replace(/<br\s*\/?>/g, '\n');
  markdown = markdown.replace(/<div>/g, '\n').replace(/<\/div>/g, '\n');

  // Strip remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '');

  // Decode basic HTML entities
  markdown = markdown.replace(/&nbsp;/g, ' ')
                     .replace(/&amp;/g, '&')
                     .replace(/&lt;/g, '<')
                     .replace(/&gt;/g, '>')
                     .replace(/&quot;/g, '"')
                     .replace(/&#39;/g, "'");

  // Clean duplicate newlines
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

  // Create excerpt from the first paragraph
  const paragraphs = markdown.split('\n\n').filter(p => !p.startsWith('#') && !p.startsWith('>') && !p.startsWith('|') && p.trim().length > 0);
  const excerpt = paragraphs[0] ? paragraphs[0].substring(0, 150).trim() + '...' : 'Financial guide by Numeraise.';

  const slug = file.replace('.html', '');

  // Estimate read time (approx 200 words per minute)
  const words = markdown.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;

  const frontmatter = `---
title: "${title}"
date: "${date}"
excerpt: "${excerpt}"
readTime: "${readTime}"
author: "${author}"
---

${markdown}`;

  const destPath = path.join(contentBlogDir, `${slug}.md`);
  fs.writeFileSync(destPath, frontmatter);
  console.log(`Converted ${file} to markdown at ${destPath}`);
});
