import fs from 'fs/promises';
import matter from 'gray-matter';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const files = await fs.readdir('content/posts');
  const tags = new Set<string>();
  for (const file of files) {
    const src = await fs.readFile(`content/posts/${file}`, 'utf8');
    const { data } = matter(src);
    if (data.tags) {
      for (const tag of data.tags) tags.add(tag);
    }
  }
  return Array.from(tags).map((tag) => ({ tag }));
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const files = await fs.readdir('content/posts');
  const posts = [] as { slug: string; title: string }[];
  for (const file of files) {
    const src = await fs.readFile(`content/posts/${file}`, 'utf8');
    const { data } = matter(src);
    if (data.tags?.includes(params.tag)) {
      const slug = file.replace(/\.mdx?$/, '');
      posts.push({ slug, title: data.title });
    }
  }
  if (!posts.length) return notFound();
  return (
    <div className="prose mx-auto dark:prose-invert p-6">
      <h1>Tag: {params.tag}</h1>
      <ul>
        {posts.map(({ slug, title }) => (
          <li key={slug}>
            <Link href={`/posts/${slug}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
