create table if not exists  quizzes(
  id uuid primary key default gen_random_uuid(),
  ref uuid references public.summaries(id) on delete cascade not null,
  content jsonb not null
)
