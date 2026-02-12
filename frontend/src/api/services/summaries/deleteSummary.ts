import { supabase } from "@/supabase/client";

export default async function deleteSummary(id: string) {
  return await supabase.from("summaries")
    .delete()
    .eq("id", id)
}
