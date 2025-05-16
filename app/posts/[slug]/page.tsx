import fs from 'fs/promises';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  const files = await fs.readdir('content/posts');
  return files.map((f) => ({ slug: f.replace(/\.mdx?$/, '') }));
}

export default async function Post({ params }: { params: { slug: string } }) {
  const path = `content/posts/${params.slug}.mdx`;
  let source;
  try {
    source = await fs.readFile(path, 'utf8');
  } catch {
    return notFound();
  }
  const { data, content } = matter(source);
  const MDX = await compileMDX({ source: content });
  return (
    <article className="prose mx-auto dark:prose-invert p-6">
      <h1>{data.title}</h1>
      <MDX />
    </article>
  );
}
