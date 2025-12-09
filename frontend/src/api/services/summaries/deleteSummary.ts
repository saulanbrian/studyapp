import { supabase } from "@/supabase/client";

export default async function deleteSummary(id: string) {
  const { data, error } = await supabase.from("summaries")
    .delete()
    .eq("id", id)
  if (error) throw error
  return data
}
