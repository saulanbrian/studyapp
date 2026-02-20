import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { MultipleChoiceOption, Question, Quiz, TrueOrFalseOption } from "../api/types/Quiz";
import { useEffect, useState } from "react";


type Choice = MultipleChoiceOption | TrueOrFalseOption

type Q = {
  id: string;
  currentQuestionNumber: number;
  currentScore: number;
}

type QuizStore = {
  quizzes: Q[];
  addQuiz: (quiz: Q) => void;
  updateQuiz: (id: string, updater: (quiz: Q) => Q) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      quizzes: [],
      addQuiz: (quiz: Q) => set((state) => ({
        quizzes: state.quizzes.find(q => q.id === quiz.id)
          ? state.quizzes
          : [...state.quizzes, quiz]
      })),
      updateQuiz: (id: string, updater: (quiz: Q) => Q) => {
        set(state => ({
          quizzes: state.quizzes.map(q => q.id === id
            ? updater(q)
            : q
          )
        }))
      },
      reset: () => set(state => ({ quizzes: [] }))
    }),
    {
      name: "quiz-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)

export const useGetOrCreateStoreQuiz = (id: string) => {

  const { quizzes, addQuiz } = useQuizStore()
  const [isLoading, setIsLoading] = useState(true)
  const [quiz, setQuiz] = useState(
    quizzes.find(q => q.id === id)
  )

  useEffect(() => {
    if (!quiz) {
      const newQuiz: Q = {
        id,
        currentQuestionNumber: 1,
        currentScore: 0
      }
      addQuiz(newQuiz)
      setQuiz(newQuiz)
    }
    setIsLoading(false)
  }, [])


  return { isLoading, quiz }

}


