alter table public.summaries
alter column content Type jsonb
using '{}':: jsonb;
