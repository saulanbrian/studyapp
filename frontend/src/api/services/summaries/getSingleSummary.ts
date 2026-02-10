import { supabase } from "@/supabase/client";

export default async function getSingleSummary(id: string) {
  return await supabase
    .from("summaries")
    .select("*, quizzes(id)")
    .eq("id", id)
    .single()
}
