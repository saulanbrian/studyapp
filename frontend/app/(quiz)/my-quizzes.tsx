import { useGetQuizzes } from "@/api/queries/quiz";
import { QuizPreview } from "@/components";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import { ThemedText, ThemedView } from "@/components/ui";
import { summarizeInfiniteQueryResult } from "@/utils/query";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet } from "react-native";

export default function UserQuizzes() {

  const { data, status } = useGetQuizzes()
  const router = useRouter()

  const handlePress = useCallback((id: string) => {
    router.push({
      pathname: '/(quiz)/[id]',
      params: { id }
    })
  }, [])

  return (
    <SuspendedViewWithErrorBoundary style={{ flex: 1 }} status={status}>
      {data && (
        <FlashList
          data={summarizeInfiniteQueryResult(data)}
          keyExtractor={quiz => quiz.id}
          renderItem={({ item: quiz }) => (
            <QuizPreview
              quiz={quiz}
              style={styles.quiz}
              onPress={() => handlePress(quiz.id)}
            />
          )}
          contentContainerStyle={{ padding: 4 }}
        />
      )}
    </SuspendedViewWithErrorBoundary>
  )
}


const styles = StyleSheet.create({
  quiz: {
    margin: 2
  }
})
