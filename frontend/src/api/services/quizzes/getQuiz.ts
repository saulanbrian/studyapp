import { supabase } from "@/supabase/client";

export default async function getQuiz(id: string) {
  return supabase
    .from("quizzes")
    .select("*,summaries(title)")
    .eq("id", id)
    .single()
}
