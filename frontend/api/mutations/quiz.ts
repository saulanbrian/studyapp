import { useAuth } from "@clerk/clerk-expo"
import { useMutation } from "@tanstack/react-query"
import createAxiosInstance from ".."

export const useGenerateQuiz = () => {

  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async ({ summaryId }: { summaryId: string }) => {
      const token = await getToken()
      if (token) {
        const api = createAxiosInstance(token)
        const res = await api.post('quiz/create', {
          summary_id: summaryId
        })
        return res.data
      }
    }
  })
}
