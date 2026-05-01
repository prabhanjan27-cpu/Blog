import { getPostBySlug, getPosts } from '@/lib/blog';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { Calendar, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | CloudBlog`,
    description: post.markdown.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.markdown.substring(0, 160),
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPosts().catch(() => []);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '5rem' }}>
      <Link href="/" className="flex items-center gap-2" style={{ marginBottom: '3rem', fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
        <ChevronLeft size={16} />
        Back to articles
      </Link>

      <header style={{ marginBottom: '3rem' }}>
        <div className="flex gap-2" style={{ marginBottom: '1rem' }}>
          {post.tags?.map((tag: string) => (
            <span key={tag} className="card-tag" style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
              {tag}
            </span>
          ))}
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '2rem' }}>
          {post.title}
        </h1>
        <div className="flex items-center gap-6" style={{ borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', padding: '1.5rem 0' }}>
          <div className="flex items-center gap-2">
            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #8b5cf6)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{post.author_profile?.display_name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <Calendar size={16} />
            {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>
      </header>

      <div className="markdown-content">
        <ReactMarkdown>{post.markdown}</ReactMarkdown>
      </div>
    </article>
  );
}
