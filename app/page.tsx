import fs from 'fs/promises';
import matter from 'gray-matter';
import Link from 'next/link';

export default async function Home() {
  const files = await fs.readdir('content/posts');
  const posts = await Promise.all(
    files.map(async (file) => {
      const src = await fs.readFile(`content/posts/${file}`, 'utf8');
      const { data } = matter(src);
      const slug = file.replace(/\.mdx?$/, '');
      return { slug, title: data.title };
    }),
  );
  return (
    <div className="prose mx-auto dark:prose-invert p-6">
      <h1>Posts</h1>
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
