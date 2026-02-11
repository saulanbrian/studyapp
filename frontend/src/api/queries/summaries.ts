import { useInfiniteQuery, useQuery, useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query"
import { getInfiniteSummaries } from "../services/summaries"
import { Summary } from "../types/summary"
import { PageResult } from "../types/PageResult"
import getSingleSummary from "../services/summaries/getSingleSummary"

export const useGetSummaries = () => {
  return useSuspenseInfiniteQuery<PageResult<Summary>>({
    queryKey: ["summaries"],
    queryFn: async ({ pageParam }) => {
      const data = await getInfiniteSummaries({
        page: pageParam as number
      })
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _) => lastPage.next
  })
}


export const useGetSummary = (id: string) => {
  return useSuspenseQuery<Summary>({
    queryKey: ["summary", id],
    queryFn: async () => {
      const { data, error } = await getSingleSummary(id)
      if (error) throw error
      return {
        ...data,
        quizId: data.quizzes?.id ?? null
      }
    },
  })
}
