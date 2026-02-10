import { useInfiniteQuery, useQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { PageResult } from "../types/PageResult"
import { Quiz } from "../types/Quiz"
import getInfiniteQuiz from "../services/quizzes/getInfiniteQuiz"
import getQuizBySummaryId from "../services/quizzes/getQuizBySummaryId"

export const useGetInfiniteQuiz = () => {
  return useSuspenseInfiniteQuery<PageResult<Quiz>>({
    queryKey: ["quizzes"],
    queryFn: async ({ pageParam: page }) => {
      const data = await getInfiniteQuiz({ page: page as number })
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.next
  })
}

export const useGetQuizBySummaryId = (summaryId: string) => {
  return useQuery<Quiz>({
    queryKey: ["summary", summaryId, "quiz"],
    queryFn: async () => {
      const { data, error } = await getQuizBySummaryId(summaryId)
      if (error) throw error
      return {
        ...data,
        summaryTitle: data.summaries.title
      }
    },
  })
}
