import { useGetQuiz } from "@/api/queries/quiz";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { useThemeContext } from "@/context/Theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Quiz, Question } from "@/types/data";
import { useCallback, useState } from "react";

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

  const [currentQuestion, setCurrentQuestion] = useState<Question>(quiz.questions[0])
  const { theme: { textPrimary } } = useThemeContext()

  const next = useCallback(() => {
    const currentIndex = quiz.questions.findIndex(question => question.id === currentQuestion.id)
    if (quiz.questions.length > currentIndex + 1) {
      setCurrentQuestion(quiz.questions[currentIndex + 2])
    }
  }, [quiz, currentQuestion])

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
              onPress={next}
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
      <ActivityIndicator color={theme.textPrimary} />
      <ThemedButton onPress={() => router.back()}>
        <ThemedText> come back later</ThemedText>
      </ThemedButton>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
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
  }
})
