import { useGetQuiz } from "@/api/queries/quiz";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import { StandardCTAButton, ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { useThemeContext } from "@/context/Theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Quiz, Question } from "@/types/data";
import { startTransition, useActionState, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import useQuiz from "@/hooks/useQuiz";
import useAuthenticatedRequest from "@/hooks/useAuthenticatedRequest";
import { AnimatedThemedView } from "@/components/ui/ThemedView";
import { FadeIn, useSharedValue, ZoomIn } from "react-native-reanimated";
import useQuizUpdater from "@/api/updater/quiz";
import { AnimatedThemedText } from "@/components/ui/ThemedText";

export default function QuizPage() {

  const { id } = useLocalSearchParams()
  const { status, data, refetch } = useGetQuiz(id as string)

  return (
    <SuspendedViewWithErrorBoundary
      style={{ flex: 1 }}
      status={status}
      retryCallback={refetch}
    >
      {data && (data.status === 'processing'
        ? <ProcessingScreen />
        : <MainScreen quiz={data} />
      )}
    </SuspendedViewWithErrorBoundary>
  )
}

const MainScreen = ({ quiz }: { quiz: Quiz }) => {

  const {
    currentQuestion,
    isFinished,
    chooseAnswer,
    reset,
    score
  } = useQuiz(quiz)

  const navigation = useNavigation()
  const { theme: { textPrimary } } = useThemeContext()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (!isFinished) {
          return (
            <QuestionCounter
              currentQuestionNumber={currentQuestion.questionNumber}
              numberOfQuestions={quiz.number_of_questions}
            />
          )
        }
      }
    })
  }, [currentQuestion, quiz, isFinished])

  if (isFinished) return (
    <ResultScreen
      score={score}
      numberOfQuestions={quiz.number_of_questions}
      resetCallback={reset}
      quizId={quiz.id}
      highestScore={quiz.highest_score}
    />
  )

  return (
    <ThemedView style={styles.mainScreenContainer}>

      <ThemedView style={styles.questionContainer}>
        <ThemedText style={styles.currentQuestion} adjustsFontSizeToFit>
          {currentQuestion.question_text}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.optionsContainer}>
        {currentQuestion.options.map(option => {
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => chooseAnswer(option)}
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
  const navigation = useNavigation()

  return (
    <ThemedView style={{ flex: 1 }}>

      <ThemedView style={styles.autoCenterContainer}>
        <ActivityIndicator color={theme.textPrimary} />
        <ThemedText>working on your quiz</ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <StandardCTAButton
          label='come back later'
          onPress={navigation.goBack}
          outlined
        />
      </ThemedView>

    </ThemedView>
  )
}

enum SyncStatus {
  isError = 'error',
  isSuccess = 'success',
  isIdle = 'idle'
}

const ResultScreen = ({
  score,
  numberOfQuestions,
  resetCallback,
  quizId,
  highestScore
}: {
  score: number;
  numberOfQuestions: number;
  resetCallback: () => void;
  quizId: string;
  highestScore: number
}) => {

  const navigation = useNavigation()
  const { getApi } = useAuthenticatedRequest()
  const { updateQuiz } = useQuizUpdater()
  const [syncingData, setSyncingData] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.isIdle)


  const syncData = useCallback(async () => {
    setSyncingData(true)
    const api = await getApi()
    if (api) {
      try {
        const res = await api.patch(`quiz/${quizId}`, { highest_score: score })
        if (res.status === 200) setSyncStatus(SyncStatus.isSuccess)
        updateQuiz({ quizId, updateField: { highest_score: score } })
      } catch (e) {
        console.log(e)
        setSyncStatus(SyncStatus.isError)
      }
    }
    setSyncingData(false)
  }, [])

  useEffect(() => {
    if (score > highestScore) {
      syncData()
    }
  }, [])

  return (
    <ThemedView style={{ flex: 1 }} >

      <ThemedView style={styles.autoCenterContainer}>
        <ThemedText style={styles.scoreText}>{score} / {numberOfQuestions}</ThemedText>
        {syncingData && <ThemedText style={{ fontSize: 8 }}>syncing data...</ThemedText>}
      </ThemedView>

      <ThemedView
        style={styles.buttonContainer}
      >
        <StandardCTAButton
          label='retake'
          onPress={resetCallback}
          outlined
          disabled={syncStatus === SyncStatus.isError || syncingData}
        />
        <StandardCTAButton
          label='back'
          onPress={navigation.goBack}
          disabled={syncStatus === SyncStatus.isError || syncingData}
        />
      </ThemedView>

    </ThemedView>
  )

}


type QuestionCounterProps = {
  currentQuestionNumber: number;
  numberOfQuestions: number
}

const QuestionCounter = ({
  currentQuestionNumber,
  numberOfQuestions
}: QuestionCounterProps) => {

  return (
    <ThemedView>
      <ThemedText adjustsFontSizeToFit>
        {currentQuestionNumber} / {numberOfQuestions}
      </ThemedText>
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
