import { useGenerateQuiz } from "@/api/mutations/quiz";
import { useGetSummary } from "@/api/queries/summary";
import useSummaryUpdater from "@/api/updater/summary";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { useThemeContext } from "@/context/Theme";
import { Summary } from "@/types/data";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native'

export default function DetailedSummary() {

  const navigation = useNavigation()
  const { id } = useLocalSearchParams()
  const { status, data } = useGetSummary(id as string)

  useEffect(() => {
    if (data) {
      navigation.setOptions({
        headerTitle: data.title,
        headerRight: () => (
          <QuizButton
            summaryId={data.id}
            quizId={data.quiz_id}
          />
        )
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


type QuizButtonProps = {
  quizId: string | null;
  summaryId: string
}

const QuizButton = ({ quizId, summaryId }: QuizButtonProps) => {

  const { theme } = useThemeContext()
  const router = useRouter()
  const { mutate: generateQuiz, status, data: generatedQuiz } = useGenerateQuiz()
  const { updateSummary } = useSummaryUpdater()

  const handlePress = useCallback(() => {

    if (quizId) {
      router.navigate({
        pathname: '/(quiz)/[id]',
        params: { id: quizId }
      })
    } else {
      generateQuiz({ summaryId })
    }

  }, [quizId, summaryId])


  useEffect(() => {
    if (status === 'success' && generatedQuiz.id) {
      updateSummary({
        id: summaryId,
        updateField: { quiz_id: generatedQuiz.id }
      })
      router.navigate({
        pathname: '/(quiz)/[id]',
        params: { id: generatedQuiz.id }
      })
    }
  }, [status, generatedQuiz])


  return (
    <ThemedButton
      style={styles.quizButton}
      onPress={handlePress}
      disabled={status === 'pending'}
    >
      {status === 'pending' ? (
        <ActivityIndicator />
      ) : (
        <>
          <ThemedText>take a quiz</ThemedText>
          <Feather
            name={'arrow-right-circle'}
            color={theme.textPrimary}
            size={16}
          />
        </>
      )}
    </ThemedButton>
  )
}



const styles = StyleSheet.create({
  quizButton: {
    padding: 8,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
    alignSelf: 'flex-end'
  }
})
