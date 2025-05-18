import { Quiz, UpdatableDataFields } from "@/types/data";
import { useQueryClient } from "@tanstack/react-query";



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

  }

  return { updateQuiz }

}
