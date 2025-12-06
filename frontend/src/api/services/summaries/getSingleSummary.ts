import { supabase } from "@/supabase/client";

export default async function getSingleSummary(id: string) {
  const { data, error } = await supabase
    .from("summaries")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}
