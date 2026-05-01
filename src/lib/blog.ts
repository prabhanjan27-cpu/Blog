import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function getPosts() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:profiles(display_name)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPostBySlug(slug: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:profiles(display_name)')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}

// Client-side helper (can be used in Server Actions too)
export async function createPost(title: string, markdown: string, tags: string[]) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Note: This requires an active session via the client/server client
  // In a real app, you'd call this from a Server Action
  return { title, slug, markdown, tags };
}
