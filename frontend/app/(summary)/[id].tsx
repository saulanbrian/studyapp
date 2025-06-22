import { useGenerateQuiz } from "@/api/mutations/quiz";
import { useGetSummary } from "@/api/queries/summary";
import useSummaryUpdater from "@/api/updater/summary";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { useThemeContext } from "@/context/Theme";
import { Summary } from "@/types/data";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native'

export default function DetailedSummary() {

  const navigation = useNavigation()
  const { id, title } = useLocalSearchParams()
  const { status, data, refetch } = useGetSummary(id as string)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title
    })
  }, [])

  useEffect(() => {
    if (data) {
      navigation.setOptions({
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
    <SuspendedViewWithErrorBoundary
      status={status}
      retryCallback={refetch}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ padding: 8 }}>
        {data?.content.split('\n').map((line, i) => {

          const isSubHeading = line.startsWith('###')
          const isHeading = line.startsWith('##')

          if (isHeading) {
            return (
              <ThemedText style={styles.heading} key={i.toString()}>
                {line.replaceAll('#', '').trim()}
              </ThemedText>
            )
          }

          if (isSubHeading) {
            return (
              <ThemedText style={styles.subHeading} key={i.toString()}>
                {line.replaceAll('#', '').trim()}
              </ThemedText>
            )
          }

          return (
            <ThemedText style={styles.text} key={i.toString()}>
              {line.replaceAll('*', '').trim()}
            </ThemedText>
          )

        })}
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
  const { mutate: generateQuiz, status, data: updatedSummary } = useGenerateQuiz()
  const { updateSummary } = useSummaryUpdater()

  const handlePress = useCallback(() => {

    if (quizId) {
      router.replace({
        pathname: '/(quiz)/[id]',
        params: { id: quizId }
      })
    } else {
      generateQuiz(summaryId)
    }

  }, [quizId, summaryId])


  useEffect(() => {
    if (updatedSummary)
      router.navigate({
        pathname: '/(quiz)/[id]',
        params: { id: updatedSummary.quiz_id! }
      })
  }, [updatedSummary])


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
  heading: {
    fontSize: 24,
    marginBottom: 20
  },
  subHeading: {
    fontSize: 18,
    marginBottom: 12
  },
  quizButton: {
    padding: 8,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
    alignSelf: 'flex-end'
  },
  text: {
    fontWeight: 'semibold',
    marginBottom: 12
  }
})
