import { getPosts } from '@/lib/blog';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

export default async function Home() {
  const posts = await getPosts().catch(() => []);

  return (
    <div className="animate-fade-in">
      <header>
        <h1 className="hero-title">
          Future of <span style={{ color: 'var(--accent)' }}>Cloud</span> <br /> 
          & Web Engineering
        </h1>
        <p className="hero-subtitle">
          In-depth technical articles, cloud architecture guides, and modern web development insights.
        </p>
      </header>

      <div className="grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/${post.slug}`}
              className="card"
            >
              <div className="card-tag">
                {post.tags?.[0] || 'Uncategorized'}
              </div>
              <h2 className="card-title">
                {post.title}
              </h2>
              <p className="card-excerpt">
                {post.markdown.substring(0, 150)}...
              </p>
              <div className="card-footer">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
                <ArrowRight size={16} color="var(--accent)" />
              </div>
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No posts found.</p>
            <p style={{ fontSize: '0.875rem' }}>Start by creating your first article in the Supabase dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
