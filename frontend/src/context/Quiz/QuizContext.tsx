import { Quiz } from "@/src/api/types/Quiz";
import { createContext, PropsWithChildren, useContext } from "react";

const QuizContext = createContext<Quiz | undefined>(undefined)

export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error("Cannot use QuizContext outside its provider")
  }
  return context
}

export default function QuizContextProvider({
  children,
  ...quiz
}: PropsWithChildren<Quiz>) {

  return (
    <QuizContext.Provider value={{ ...quiz }}>
      {children}
    </QuizContext.Provider>
  )
} 
