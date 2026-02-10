import { supabase } from "@/supabase/client";

export default async function createNewQuiz(summaryId: string) {
  return await supabase
    .from("quizzes")
    .insert({
      ref: summaryId,
    })
    .select("*,summaries(title)")
    .single()
}
