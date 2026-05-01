-- Database Schema for Cloud-Based Blog Platform

-- 1. Profiles Table
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  role text check (role in ('admin','writer','reader')) default 'writer'
);

-- 2. Posts Table
create table posts (
  id uuid primary key default gen_random_uuid(),
  author uuid references profiles(id) on delete cascade,
  title text not null,
  slug text unique not null,
  markdown text not null,
  published boolean default false,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Comments Table
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

-- 4. Row-Level Security (RLS)
alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;

-- 5. Policies
-- Profiles: Public can read profiles
create policy "public read profiles" on profiles
for select using (true);

-- Profiles: Users can insert their own profile
create policy "users insert own" on profiles
for insert with check (auth.uid() = id);

-- Profiles: Users can update their own profile
create policy "users update own" on profiles
for update using (auth.uid() = id);

-- Posts: Public can read published posts
create policy "public read published" on posts
for select using (published = true);

-- Posts: Authors can manage their own posts
create policy "authors manage own" on posts
for all using (auth.uid() = author);

-- Comments: Public can read comments
create policy "comment read" on comments for select using (true);

-- Comments: Auth users can write comments
create policy "comment write" on comments for insert with check (auth.uid() = user_id);

-- 6. Trigger for profile creation on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'writer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
