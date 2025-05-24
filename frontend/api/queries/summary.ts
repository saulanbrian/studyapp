import { InfiniteData, useInfiniteQuery, useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-expo'
import createAxiosInstance from '../'
import { Summary } from '@/types/data'
import { InfiniteQueryPage } from '@/utils/query'

export const useGetSummaries = () => {

  const { getToken } = useAuth()

  return useInfiniteQuery<InfiniteQueryPage<Summary>>({
    queryKey: ['summaries'],
    queryFn: async ({ pageParam }) => {
      const token = await getToken()
      if (token) {
        const api = createAxiosInstance(token)
        const res = await api.get(`summary/?page=${pageParam}`)
        return res.data
      }
      throw new Error('an error has occured. please make sure you are authenticated')
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage && lastPage.next) {
        return pages.length + 1
      }
    }
  })
}


export const useGetSummary = (id: string) => {

  const { getToken } = useAuth()

  return useQuery<Summary>({
    queryKey: ['summary', id],
    queryFn: async () => {
      const token = await getToken()
      if (token) {
        const api = createAxiosInstance(token)
        const res = await api.get(`summary/${id}`)
        return res.data
      }

    },
    staleTime: 5 * 60 * 1000
  })
}


export const useGetFavoriteSummaries = () => {

  const { getToken } = useAuth()

  return useInfiniteQuery<InfiniteQueryPage<Summary>>({
    queryKey: ['summary', 'favorites'],
    queryFn: async ({ pageParam }) => {
      const token = await getToken()
      if (token) {
        const api = createAxiosInstance(token)
        const res = await api.get(`summary/favorites?page=${pageParam}`)
        return res.data
      } else throw new Error("authentication failed")
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length + 1
      }
    }
  })
}
