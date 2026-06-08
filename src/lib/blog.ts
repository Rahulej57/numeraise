import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  readTime: string;
  author: string;
}

export function getAllPosts(): BlogPost[] {
  // Return empty array if directory doesn't exist yet
  if (!fs.existsSync(contentDirectory)) return [];

  const fileNames = fs.readdirSync(contentDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data, content } = matter(fileContents);
      
      return {
        slug,
        title: data.title || slug,
        date: data.date || '1970-01-01',
        excerpt: data.excerpt || '',
        content,
        readTime: data.readTime || '3 min read',
        author: data.author || 'Numeraise Team'
      };
    });

  // Sort posts by date descending
  return allPosts.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title || slug,
      date: data.date || '1970-01-01',
      excerpt: data.excerpt || '',
      content,
      readTime: data.readTime || '3 min read',
      author: data.author || 'Numeraise Team'
    };
  } catch (e) {
    return null;
  }
}
