import { Quiz, UpdatableDataFields } from "@/types/data";
import { InfiniteQueryPage, updateInifiniteQueryResultById } from "@/utils/query";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";



type QuizUpdaterProps = {
  quizId: string;
  updateField: UpdatableDataFields<Quiz>
}

export default function useQuizUpdater() {

  const queryClient = useQueryClient()

  const updateQuiz = ({ quizId, updateField }: QuizUpdaterProps) => {

    queryClient.setQueryData<Quiz>(['quiz', quizId], prevData => {
      if (prevData) {
        return {
          ...prevData,
          ...updateField
        }
      }
    })

    queryClient.setQueryData<InfiniteData<InfiniteQueryPage<Quiz>>>(
      ['quizzes'],
      prevData => {
        if (prevData) {
          const updatedData = updateInifiniteQueryResultById({
            data: prevData,
            id: quizId,
            updateField,
          })
          return updatedData
        }
      }
    )

  }

  return { updateQuiz }

}
