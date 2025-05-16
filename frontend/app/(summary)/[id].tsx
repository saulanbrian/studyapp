import { useGetSummary } from "@/api/queries/summary";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { Summary } from "@/types/data";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet } from 'react-native'

export default function DetailedSummary() {

  const navigation = useNavigation()
  const { id } = useLocalSearchParams()
  const { status, data } = useGetSummary(id as string)

  useAttachQuizButton(data?.quiz_id)

  useEffect(() => {
    if (data) {
      navigation.setOptions({
        headerTitle: data.title
      })
    }
  }, [data])

  return (
    <SuspendedViewWithErrorBoundary style={{ flex: 1 }} status={status}>
      <ScrollView>
        {data && (
          <ThemedText>{data.content}</ThemedText>
        )}
      </ScrollView>
    </SuspendedViewWithErrorBoundary>
  )

}

const useAttachQuizButton = (quizId?: string | null) => {

  const navigation = useNavigation()

  useEffect(() => {

    if (quizId !== undefined) {
      navigation.setOptions({
        headerRight: () => {
          return (
            <ThemedButton style={styles.quizButton}>
              <ThemedText>
                {quizId ? 'take a quiz' : 'generate quiz'}
              </ThemedText>
            </ThemedButton>
          )
        }
      })
    }

  }, [quizId])
}

const styles = StyleSheet.create({
  quizButton: {
    padding: 8,
    borderRadius: 16
  }
})
