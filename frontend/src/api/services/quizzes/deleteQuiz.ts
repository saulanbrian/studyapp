import { supabase } from "@/supabase/client";

export default async function deleteQuiz(id: string) {
  return await supabase.from("quizzes")
    .delete()
    .eq("id", id)
}
