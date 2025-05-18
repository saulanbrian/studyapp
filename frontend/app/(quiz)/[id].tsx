import { useGetQuiz } from "@/api/queries/quiz";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { useThemeContext } from "@/context/Theme";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Quiz } from "@/types/data";

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
  return (
    <ThemedView style={styles.mainScreenContainer}>
      {quiz.questions.map((q, i) => (
        <ThemedText key={i}>q{i}: {q.question_text}</ThemedText>
      ))}
    </ThemedView>
  )
}


const ProcessingScreen = () => {

  const { theme } = useThemeContext()

  return (
    <ThemedView style={{ flex: 1 }}>
      <ActivityIndicator color={theme.textPrimary} />
      <ThemedButton>
        <ThemedText> come back later</ThemedText>
      </ThemedButton>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  mainScreenContainer: {
    flex: 1
  },
  processingScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
