import { Quiz } from "@/types/data";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import createAxiosInstance from "..";

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
