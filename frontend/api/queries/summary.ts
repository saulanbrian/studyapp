import { InfiniteData, useInfiniteQuery, useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-expo'
import createAxiosInstance from '../'
import { Summary } from '@/types/data'
import { InfiniteQueryPage } from '@/utils/query'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'

export const useGetSummaries = () => {

  const { getApi } = useAuthenticatedRequest()

  return useInfiniteQuery<InfiniteQueryPage<Summary>>({
    queryKey: ['summaries'],
    queryFn: async ({ pageParam }) => {
      const api = await getApi()
      if (api) {
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

  const { getApi } = useAuthenticatedRequest()

  return useQuery<Summary>({
    queryKey: ['summary', id],
    queryFn: async () => {
      const api = await getApi()
      if (api) {
        const res = await api.get(`summary/${id}`)
        return res.data
      }

    },
    staleTime: 5 * 60 * 1000
  })
}


export const useGetFavoriteSummaries = () => {

  const { getApi } = useAuthenticatedRequest()

  return useInfiniteQuery<InfiniteQueryPage<Summary>>({
    queryKey: ['summary', 'favorites'],
    queryFn: async ({ pageParam }) => {
      const api = await getApi()
      if (api) {
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
