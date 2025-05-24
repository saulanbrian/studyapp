import { Quiz, Question, Option } from "@/types/data";
import { useCallback, useMemo, useState } from "react";


type QuestionWithNumber = Question & {
  questionNumber: number
}

export default function useQuiz(quiz: Quiz) {

  const [currentQuestion, setCurrentQuestion] = useState<QuestionWithNumber>(
    {
      ...quiz.questions[0],
      questionNumber: 1
    }
  )

  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const chooseAnswer = useCallback((answer: Option) => {
    if (answer.is_correct) setScore(prevScore => prevScore + 1)
    if (currentQuestion.questionNumber < quiz.number_of_questions) {
      setCurrentQuestion({
        ...quiz.questions[currentQuestion.questionNumber],
        questionNumber: currentQuestion.questionNumber + 1
      })
    } else setIsFinished(true)
  }, [score, currentQuestion, quiz])

  const reset = useCallback(() => {
    setCurrentQuestion({
      ...quiz.questions[0],
      questionNumber: 1
    })
    setScore(0)
    setIsFinished(false)
  }, [])

  return {
    currentQuestion,
    score,
    isFinished,
    chooseAnswer,
    reset
  }

}
