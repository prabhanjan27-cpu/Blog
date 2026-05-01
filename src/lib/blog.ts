import { createClient } from '@/utils/supabase/server';

export async function getPosts() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select('*, author_profile:profiles(display_name)')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPostBySlug(slug: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select('*, author_profile:profiles(display_name)')
    .eq('slug', slug)
    .eq('published', true)
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

  return { title, slug, markdown, tags };
}
