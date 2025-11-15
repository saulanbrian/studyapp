alter table if exists public.summaries
alter column document_url set not null,
add constraint summaries_title_unique unique(title);
