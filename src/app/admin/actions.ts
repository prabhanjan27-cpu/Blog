'use server'

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createPostAction(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const title = formData.get('title') as string;
  const markdown = formData.get('markdown') as string;
  const tagsStr = formData.get('tags') as string;
  const tags = tagsStr.split(',').map(t => t.trim()).filter(t => t);

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Ensure profile exists (repair for users who signed up before trigger was fixed)
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profile) {
    await supabase.from('profiles').insert({ 
      id: user.id, 
      display_name: user.user_metadata.full_name || 'Author',
      role: 'writer' 
    });
  }

  const { error } = await supabase.from('posts').insert({
    author: user.id,
    title,
    slug,
    markdown,
    tags,
    published: true,
  });

  if (error) {
    console.error(error);
    return redirect('/admin?error=' + encodeURIComponent(error.message));
  }

  return redirect('/' + slug);
}
