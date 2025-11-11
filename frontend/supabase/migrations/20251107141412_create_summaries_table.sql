create extension if not exists "pgcrypto";

create table if not exists public.summaries(
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  owner uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text
);

create index if not exists
idx_summaries_owner 
on public.summaries(owner);
