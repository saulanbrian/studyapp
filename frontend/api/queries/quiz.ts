import { Quiz } from "@/types/data";
import { useAuth } from "@clerk/clerk-expo";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import createAxiosInstance from "..";
import { InfiniteQueryPage } from "@/utils/query";

export function useGetQuiz(id: string) {

  const { getToken } = useAuth()

  return useQuery<Quiz>({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const token = await getToken()
      if (token) {
        const api = createAxiosInstance(token)
        const res = await api.get(`quiz/${id}`)
        return res.data
      }
      else throw new Error('authentication failed')
    }
  })
}

export function useGetQuizzes() {

  const { getToken } = useAuth()

  return useInfiniteQuery<InfiniteQueryPage<Quiz>>({
    queryKey: ['quizzes'],
    queryFn: async ({ pageParam }) => {
      const token = await getToken()
      if (token) {
        const api = createAxiosInstance(token)
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
