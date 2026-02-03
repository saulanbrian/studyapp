alter table if exists public.quizzes
alter column ref set not null,
alter column content drop not null 
