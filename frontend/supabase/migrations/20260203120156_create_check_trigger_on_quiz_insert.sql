create or replace function check_summary_content()
returns trigger as $$
declare summary_content text;
begin

  select content into summary_content 
  from public.summaries
  where id = new.ref;
  
  if summary_content is null
  then raise exception 'Cannot create a quiz for a summary without content';
  end if;

  return new;

end;
$$ language plpgsql;


create trigger quiz_summary_content_check
before insert on quizzes
for each row
execute function check_summary_content()
