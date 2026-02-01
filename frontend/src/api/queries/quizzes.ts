import { useInfiniteQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { PageResult } from "../types/PageResult"
import { Quiz, QuizWithMetadata } from "../types/Quiz"
import getInfiniteQuiz from "../services/quizzes/getInfiniteQuiz"

export const useGetInfiniteQuiz = () => {
  return useSuspenseInfiniteQuery<PageResult<QuizWithMetadata>>({
    queryKey: ["quizzes"],
    queryFn: async ({ pageParam: page }) => {
      const data = await getInfiniteQuiz({ page: page as number })
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.next
  })
}
