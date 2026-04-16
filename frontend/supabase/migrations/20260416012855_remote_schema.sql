create extension if not exists "hypopg" with schema "extensions";

create extension if not exists "index_advisor" with schema "extensions";

drop extension if exists "pg_net";

alter table "public"."summaries" drop constraint "summary_owner_title_unique";

drop index if exists "public"."summary_owner_title_unique";

CREATE INDEX idx_quizzes_ref ON public.quizzes USING btree (ref);

drop trigger if exists "objects_delete_delete_prefix" on "storage"."objects";

drop trigger if exists "objects_insert_create_prefix" on "storage"."objects";

drop trigger if exists "objects_update_create_prefix" on "storage"."objects";

drop trigger if exists "prefixes_create_hierarchy" on "storage"."prefixes";

drop trigger if exists "prefixes_delete_hierarchy" on "storage"."prefixes";


  create policy "Give users access to own folder 9v3moz_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'summary_bucket'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



  create policy "Give users access to own folder 9v3moz_1"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'summary_bucket'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



  create policy "Give users access to own folder 9v3moz_2"
  on "storage"."objects"
  as permissive
  for update
  to public
using (((bucket_id = 'summary_bucket'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



  create policy "Give users access to own folder 9v3moz_3"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'summary_bucket'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


