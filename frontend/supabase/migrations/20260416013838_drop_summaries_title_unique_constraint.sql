alter table public.summaries
drop constraint if exists
summaries_title_unique;

alter table public.summaries
add constraint summaries_owner_title_unique
UNIQUE (owner,title);
