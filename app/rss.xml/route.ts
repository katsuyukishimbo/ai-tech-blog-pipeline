import fs from 'fs/promises';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

export async function GET() {
  const files = await fs.readdir('content/posts');
  let items = '';
  for (const file of files) {
    const src = await fs.readFile(`content/posts/${file}`, 'utf8');
    const { data } = matter(src);
    const slug = file.replace(/\.mdx?$/, '');
    items += `<item><title>${data.title}</title><link>${process.env.SITE_URL}/posts/${slug}</link></item>`;
  }
  const rss = `<?xml version="1.0"?><rss version="2.0"><channel><title>Blog</title>${items}</channel></rss>`;
  return new NextResponse(rss, { headers: { 'Content-Type': 'application/rss+xml' } });
}
