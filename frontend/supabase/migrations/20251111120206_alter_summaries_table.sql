create type summary_status as enum (
  'pending', 'success', 'error'
);

alter table public.summaries
alter column created_at set not null,
add column cover_url text,
add column description text,
add column status summary_status default 'pending' not null;
