create type quiz_status as enum (
  'pending', 'success', 'error'
);

alter table if exists public.quizzes
add column status quiz_status default 'pending' not null,
add column created_at timestamptz default now();
