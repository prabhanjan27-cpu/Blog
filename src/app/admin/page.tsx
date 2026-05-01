import { createPostAction } from './actions';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Create New Article</h1>
        <p style={{ color: 'var(--text-muted)' }}>Share your latest cloud insights with the world.</p>
      </header>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form action={createPostAction} className="card flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label style={{ fontWeight: 500 }}>Post Title</label>
          <input 
            name="title" 
            type="text" 
            required 
            placeholder="e.g. Scaling Next.js with Supabase"
            style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: '#fff', fontSize: '1.125rem' }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label style={{ fontWeight: 500 }}>Tags (comma separated)</label>
          <input 
            name="tags" 
            type="text" 
            placeholder="cloud, nextjs, supabase"
            style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: '#fff' }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label style={{ fontWeight: 500 }}>Content (Markdown)</label>
          <textarea 
            name="markdown" 
            required 
            rows={15}
            placeholder="Write your article in markdown here..."
            style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', color: '#fff', fontFamily: 'monospace', resize: 'vertical' }}
          />
        </div>

        <div className="flex items-center justify-between" style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Markdown rendering is supported.</p>
          <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2.5rem', cursor: 'pointer' }}>
            Publish Article
          </button>
        </div>
      </form>
    </div>
  );
}
