alter table public.summaries
drop constraint if exists 
summaries_title_key;

alter table public.summaries 
add constraint
summary_owner_title_unique
UNIQUE (owner,title);
