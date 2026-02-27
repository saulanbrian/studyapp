import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { MultipleChoiceOption, Question, Quiz, TrueOrFalseOption } from "../api/types/Quiz";
import { useCallback } from "react";
import Toast from "react-native-toast-message";
import useQueryUpdater from "../api/hooks/useQueryUpdater";
import updateQuiz from "../api/services/quizzes/updateQuiz";


type Choice = MultipleChoiceOption | TrueOrFalseOption

export type QuizResultQuestion = Omit<Question, 'choices'> & {
  choices: (Choice & { selected: boolean })[]
}

type Result = {
  quizId: string;
  questions: QuizResultQuestion[]
}

type QuizResultStore = {
  results: Result[];
  saveResult: (result: Result) => void
}

const useQuizResultStore = create<QuizResultStore>()(
  persist(
    (set) => ({
      results: [],
      saveResult: (result: Result) => set((state) => ({
        results: state.results.find(res => res.quizId === result.quizId)
          ? state.results.map(res => {
            return res.quizId === result.quizId ? result : res
          })
          : [...state.results, result]
      }))
    }),
    {
      name: "quiz-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)


export const useQuizResult = () => {

  const { results, saveResult: saveToStore } = useQuizResultStore()
  const { updateDataFromInfiniteQuery } = useQueryUpdater<Quiz>()

  const saveResult = useCallback(async (result: Result) => {

    showPendingToast()

    let correctAnswers = 0

    result.questions.forEach(question => {
      question.choices.forEach(choice => {
        if (choice.is_correct && choice.selected) {
          correctAnswers++
        }
      })
    })

    const { data, error } = await updateQuiz({
      id: result.quizId,
      updateFields: { score: correctAnswers }
    })

    if (error) {
      showErrorToast()
      return
    }

    if (!error && data) {
      updateDataFromInfiniteQuery({
        id: result.quizId,
        queryKey: ["quizzes"],
        updateFields: {
          score: correctAnswers
        }
      })
      saveToStore(result)
    }
    showSucessToast()

  }, [])

  const showPendingToast = useCallback(() => {
    Toast.show({
      type: "neutral",
      autoHide: true,
      text2: "saving result...",
      visibilityTime: 2000
    })
  }, [])

  const showSucessToast = useCallback(() => {
    Toast.show({
      type: "success",
      autoHide: true,
      text2: "result saved!",
      visibilityTime: 2000
    })
  }, [])

  const showErrorToast = useCallback(() => {
    Toast.show({
      type: "error",
      autoHide: true,
      text2: "error saving result",
      visibilityTime: 2000
    })
  }, [])

  return { results, saveResult }

}
