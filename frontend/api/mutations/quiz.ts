import { useAuth } from "@clerk/clerk-expo"
import { useMutation } from "@tanstack/react-query"
import createAxiosInstance from ".."
import useAuthenticatedRequest from "@/hooks/useAuthenticatedRequest"

export const useGenerateQuiz = () => {

  const { getApi } = useAuthenticatedRequest()

  return useMutation({
    mutationFn: async ({ summaryId }: { summaryId: string }) => {
      const api = await getApi()
      if (api) {
        const res = await api.post('quiz/create', {
          summary_id: summaryId
        })
        return res.data
      }
    }
  })
}
