import { useGetQuiz } from "@/api/queries/quiz";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { useThemeContext } from "@/context/Theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Quiz, Question } from "@/types/data";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function QuizPage() {

  const { id } = useLocalSearchParams()
  const { status, data } = useGetQuiz(id as string)

  return (
    <SuspendedViewWithErrorBoundary
      style={{ flex: 1 }}
      status={status}>
      {data && (data.status === 'processing'
        ? <ProcessingScreen />
        : <MainScreen quiz={data} />
      )}
    </SuspendedViewWithErrorBoundary>
  )
}


type QuestionWithNumber = {
  question: Question;
  questionNumber: number
}

const MainScreen = ({ quiz }: { quiz: Quiz }) => {

  const [currentQuestion, setCurrentQuestion] = useState<QuestionWithNumber>({
    question: quiz.questions[0],
    questionNumber: 1
  })
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const questionLength = useMemo(() => quiz.questions.length, [quiz])

  const { theme: { textPrimary } } = useThemeContext()
  const navigation = useNavigation()

  const next = useCallback((isPreviousAnswerCorrect: boolean) => {
    if (isPreviousAnswerCorrect) setCorrectAnswers(prev => prev + 1)
    if (questionLength > currentQuestion.questionNumber) {
      setCurrentQuestion({
        question: quiz.questions[currentQuestion.questionNumber],
        questionNumber: currentQuestion.questionNumber + 1
      })
    } else {
      setIsFinished(true)
    }
  }, [quiz, currentQuestion])

  const reset = useCallback(() => {
    setCurrentQuestion({
      question: quiz.questions[0],
      questionNumber: 1
    })
    setCorrectAnswers(0)
    setIsFinished(false)
  }, [quiz])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (!isFinished) {
          return (
            <QuestionCounter
              currentQuestionNumber={currentQuestion.questionNumber}
              totalQuestionLength={questionLength}
            />
          )
        }
      }
    })
  }, [currentQuestion, questionLength, quiz, isFinished])

  if (isFinished) return (
    <ResultScreen
      correctAnswers={correctAnswers}
      questionLength={questionLength}
      resetCallback={reset}
    />
  )

  return (
    <ThemedView style={styles.mainScreenContainer}>
      <ThemedView style={styles.questionContainer}>
        <ThemedText style={styles.currentQuestion} adjustsFontSizeToFit>
          {currentQuestion.question.question_text}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.optionsContainer}>
        {currentQuestion.question.options.map(option => {
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => next(option.is_correct)}
              style={[{ borderColor: textPrimary }, styles.optionButton]}>
              <ThemedText adjustsFontSizeToFit style={styles.optionText}>
                {option.option_text}
              </ThemedText>
            </TouchableOpacity>
          )
        })}
      </ThemedView>
    </ThemedView>
  )
}


const ProcessingScreen = () => {

  const { theme } = useThemeContext()
  const router = useRouter()

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView style={styles.autoCenterContainer}>
        <ActivityIndicator color={theme.textPrimary} />
        <ThemedText>working on your quiz</ThemedText>
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        <ThemedButton
          onPress={() => router.back()}
          style={styles.button}
          outlined
        >
          <ThemedText style={{ color: theme.primary }}> come back later</ThemedText>
        </ThemedButton>
      </ThemedView>
    </ThemedView>
  )
}


const ResultScreen = ({
  correctAnswers,
  questionLength,
  resetCallback
}: {
  correctAnswers: number;
  questionLength: number;
  resetCallback: () => void;
}) => {

  const navigation = useNavigation()
  const { theme } = useThemeContext()

  return (
    <ThemedView style={{ flex: 1 }}>

      <ThemedView style={styles.autoCenterContainer}>
        <ThemedText style={styles.scoreText}>{correctAnswers} / {questionLength}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <ThemedButton
          onPress={resetCallback}
          style={styles.button}
          outlined>
          <ThemedText style={[{ color: theme.primary }, styles.buttonText]}>
            retake
          </ThemedText>
        </ThemedButton>
        <ThemedButton
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <ThemedText style={styles.buttonText}>back</ThemedText>
        </ThemedButton>
      </ThemedView>

    </ThemedView>
  )

}


type QuestionCounterProps = {
  currentQuestionNumber: number;
  totalQuestionLength: number
}

const QuestionCounter = ({
  currentQuestionNumber,
  totalQuestionLength
}: QuestionCounterProps) => {

  return (
    <ThemedView>
      <ThemedText adjustsFontSizeToFit>{currentQuestionNumber} / {totalQuestionLength}</ThemedText>
    </ThemedView>
  )

}


const styles = StyleSheet.create({
  autoCenterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  currentQuestion: {
    fontWeight: 'bold',
    fontSize: 40,
    alignSelf: 'center'
  },
  mainScreenContainer: {
    flex: 1,
    padding: 12
  },
  optionButton: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    height: 60,
    justifyContent: 'center'
  },
  optionsContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
    gap: 4
  },
  optionText: {
    fontWeight: 'bold',
  },
  processingScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  resultContainer: {
    flex: 1,
    padding: 12
  },
  buttonContainer: {
    padding: 8,
    gap: 4
  },
  scoreText: {
    fontWeight: 'bold',
    fontSize: 40,
  }
})
