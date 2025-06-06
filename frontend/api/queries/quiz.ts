import { Quiz } from "@/types/data";
import { useAuth } from "@clerk/clerk-expo";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import createAxiosInstance from "..";
import { InfiniteQueryPage } from "@/utils/query";
import useAuthenticatedRequest from "@/hooks/useAuthenticatedRequest";

export function useGetQuiz(id: string) {

  const { getApi } = useAuthenticatedRequest()

  return useQuery<Quiz>({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const api = await getApi()
      if (api) {
        const res = await api.get(`quiz/${id}`)
        return res.data
      }
      else throw new Error('authentication failed')
    }
  })
}

export function useGetQuizzes() {

  const { getApi } = useAuthenticatedRequest()

  return useInfiniteQuery<InfiniteQueryPage<Quiz>>({
    queryKey: ['quizzes'],
    queryFn: async ({ pageParam }) => {
      const api = await getApi()
      if (api) {
        const res = await api.get(`quiz/all?page=${pageParam}`)
        return res.data
      } else throw new Error('authentication failed')
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage && lastPage.next) {
        return pages.length + 1
      }
    }
  })
}
