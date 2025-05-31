import createAxiosInstance from "@/api";
import useQuizUpdater from "@/api/updater/quiz";
import { Quiz, Question, Option } from "@/types/data";
import { useAuth } from "@clerk/clerk-expo";
import { MutationStatus } from "@tanstack/react-query";
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
    reset,
  }

}


export const useQuizSync = (quizId: string) => {

  const { getToken } = useAuth()
  const [syncStatus, setSyncStatus] = useState<MutationStatus>('idle')
  const { updateQuiz } = useQuizUpdater()

  const syncData = useCallback(async (highestScore: number) => {

    setSyncStatus('pending')

    let attempts = 1

    while (attempts <= 3) {

      const token = await getToken()

      if (!token) {
        attempts++
        await new Promise(resolve => {
          setTimeout(
            resolve,
            1000 * Math.pow(2, attempts)
          )
        })
        continue
      }

      const api = createAxiosInstance(token)

      try {
        const res = await api.patch(`quiz/${quizId}`, { highest_score: highestScore })
        if (res.status === 200) {
          updateQuiz({ quizId, updateField: { highest_score: highestScore } })
          setSyncStatus('success')
          break
        }
      } catch (e) {

        if (attempts === 3) {
          setSyncStatus('error')
          break
        }

        attempts++
        await new Promise(resolve => {
          setTimeout(
            resolve,
            1000 * Math.pow(2, attempts)
          )
        })
        continue
      }
    }

  }, [])

  return {
    syncData,
    syncStatus
  }

}
