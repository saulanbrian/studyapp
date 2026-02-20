import { supabase } from "@/supabase/client";
import { Quiz } from "../../types/Quiz";

export default async function updateQuiz({
  id,
  updateFields
}: {
  id: string;
  updateFields: Partial<Omit<Quiz, 'id'>>
}) {

  return await supabase
    .from("quizzes")
    .update(updateFields)
    .eq("id", id)
    .select()
    .single()
}
