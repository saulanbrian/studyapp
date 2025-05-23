import { useGetQuiz } from "@/api/queries/quiz";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import { StandardCTAButton, ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { useThemeContext } from "@/context/Theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Quiz, Question } from "@/types/data";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import useQuiz from "@/hooks/useQuiz";

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

const MainScreen = ({ quiz }: { quiz: Quiz }) => {

  const {
    currentQuestion,
    questionLength,
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
              totalQuestionLength={questionLength}
            />
          )
        }
      }
    })
  }, [currentQuestion, questionLength, quiz, isFinished])

  if (isFinished) return (
    <ResultScreen
      score={score}
      questionLength={questionLength}
      resetCallback={reset}
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


const ResultScreen = ({
  score,
  questionLength,
  resetCallback
}: {
  score: number;
  questionLength: number;
  resetCallback: () => void;
}) => {

  const navigation = useNavigation()
  const { theme } = useThemeContext()
  const [calculatingScore, setCalculatingScore] = useState(true)

  useEffect(() => {
    setTimeout(() => { setCalculatingScore(false) }, 1000)
  }, [])

  if (calculatingScore) return (
    <ThemedView style={styles.autoCenterContainer}>
      <ActivityIndicator />
      <ThemedText>calculating score...</ThemedText>
    </ThemedView>
  )

  return (
    <ThemedView style={{ flex: 1 }}>

      <ThemedView style={styles.autoCenterContainer}>
        <ThemedText style={styles.scoreText}>{score} / {questionLength}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <StandardCTAButton label='reset' onPress={resetCallback} outlined />
        <StandardCTAButton label='back' onPress={navigation.goBack} />
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
