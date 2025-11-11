import { useInfiniteQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { getInfiniteSummaries } from "../services/summaries"
import { Summary } from "../types/summary"
import { PageResult } from "../types/PageResult"

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

