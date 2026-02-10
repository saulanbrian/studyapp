import { supabase } from "@/supabase/client";

export default async function getQuizBySummaryId(
  summaryId: string
) {

  return await supabase
    .from("quizzes")
    .select("*,summaries(title)")
    .eq("ref", summaryId)
    .single()
}
