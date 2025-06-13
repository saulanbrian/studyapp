import { useAuth } from "@clerk/clerk-expo"
import { useMutation } from "@tanstack/react-query"
import createAxiosInstance from ".."
import useAuthenticatedRequest from "@/hooks/useAuthenticatedRequest"
import { Quiz, Summary } from "@/types/data"
import useQuizUpdater from "../updater/quiz"
import useSummaryUpdater from "../updater/summary"

export const useGenerateQuiz = () => {

  const { getApi } = useAuthenticatedRequest()
  const { updateSummary } = useSummaryUpdater()

  return useMutation<Summary, unknown, string>({
    mutationFn: async (id: string) => {
      const api = await getApi()
      if (api) {
        const res = await api.post('quiz/create', {
          summary_id: id
        })
        return res.data
      }
    },
    onSuccess: ({ id, ...summary }) => {
      updateSummary({ id, updateField: { ...summary } })
    }
  })
}

export const useRetryQuizGeneration = () => {

  const { getApi } = useAuthenticatedRequest()
  const { updateQuiz } = useQuizUpdater()

  return useMutation<Quiz, unknown, string>({
    mutationFn: async (id: string) => {
      const api = await getApi()
      if (api) {
        const res = await api.post('quiz/regenerate', { id })
        return res.data
      }
    },
    onSuccess: ({ id, ...summary }) => {
      updateQuiz({ quizId: id, updateField: { ...summary } })
    }
  })
}
