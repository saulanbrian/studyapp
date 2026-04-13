import useQueryUpdater from "@/src/api/hooks/useQueryUpdater";
import createNewQuiz from "@/src/api/services/quizzes/createNewQuiz";
import { Quiz } from "@/src/api/types/Quiz";
import ActionButton, { ActionButtonProps } from "@/src/components/ActionButton";
import { useMutation } from "@tanstack/react-query";


type GenerateQuizButtonProps = Omit<ActionButtonProps, 'disabled' | 'title' | 'status'> & {
  summaryId?: string,
  onSettled: () => void;
}

export default function GenerateQuizButton({
  summaryId,
  onSettled,
  ...props
}: GenerateQuizButtonProps) {

  const { insertIntoInfiniteQuery } = useQueryUpdater<Quiz>()

  const { status, mutate } = useMutation<Quiz>({
    mutationFn: async () => {
      if (summaryId) {
        const { data, error } = await createNewQuiz(summaryId)
        if (error) throw error
        return {
          ...data,
          summaryTitle: data.summaries.title
        }
      } else {
        throw new Error("No selected Summary")
      }
    },
    onError: e => {
      console.log(e)
    },
    onSuccess: (quiz) => {
      insertIntoInfiniteQuery({ newData: quiz, queryKey: ["quizzes"] })
    },
    onSettled
  })

  return <ActionButton
    title={"Generate Quiz"}
    onPress={() => mutate()}
    status={status}
    disabled={!summaryId}
    {...props}
  />
}
