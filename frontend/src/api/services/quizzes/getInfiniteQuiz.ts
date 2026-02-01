import { supabase } from "@/supabase/client";
import { PageResult } from "../../types/PageResult";
import { Quiz, QuizWithMetadata } from "../../types/Quiz";
import getUserIdAsync from "../auth/getUserIdAsync";


const pageLimit = 10

export default async function getInfiniteQuiz({
  page
}: { page: number }): Promise<PageResult<QuizWithMetadata>> {

  const userId = await getUserIdAsync({ throwOnError: true })
  if (!userId) throw new Error(`
    UserId not found. make sure you are logged in you are logged in you are logged in you are logged in you are logged in you are logged in you are logged in you are logged in 
  `)

  const from_ = (page - 1) * pageLimit
  const to_ = page + pageLimit

  const { data: quizzes, error } = await supabase
    .from("quizzes")
    .select(`
      *,
      summaries(
        owner,
        title
      )
    `)
    .filter("summaries.owner", "eq", userId)
    .range(from_, to_)

  if (error || !quizzes) throw new Error(
    "No fata found"
  )


  const hasNextPage = quizzes.length > pageLimit;

  return {
    results: quizzes.map(q => ({
      ...q,
      summaryTitle: q.summaries.title
    })),
    next: hasNextPage ? page + 1 : undefined
  }


} 
