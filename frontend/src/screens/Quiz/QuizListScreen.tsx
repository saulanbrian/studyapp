import { useGetInfiniteQuiz } from "@/src/api/queries/quizzes";
import { mapInfiniteDataResult } from "@/src/api/utils/mapInfiniteDataResult";
import { LoadingScreen, ThemedScreen, ThemedText } from "@/src/components";
import QuizCard from "@/src/components/Quiz/QuizCard";
import { QuizStackParamList } from "@/src/navigation/Quiz/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Suspense, useEffect, useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function QuizListScreen() {
  return (
    <ThemedScreen>
      <Suspense fallback={LoadingScreen()}>
        <Quizzes />
      </Suspense>
    </ThemedScreen>
  )
}

const Quizzes = () => {

  const {
    data: quizzes,
    refetch,
    isRefetching
  } = useGetInfiniteQuiz()

  const { params } = useRoute<RouteProp<QuizStackParamList, 'QuizList'>>()
  const [selectedQuiz, setSelectedQuiz] = useState<string | undefined>()

  useEffect(() => {
    setSelectedQuiz(params?.select)
  }, [params])

  return (
    <FlashList
      data={mapInfiniteDataResult(quizzes)}
      keyExtractor={item => item.id}
      onRefresh={refetch}
      refreshing={isRefetching}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <QuizCard
          expanded={selectedQuiz === item.id}
          onPress={() => setSelectedQuiz(item.id)}
          selected={selectedQuiz === item.id}
          {...item}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={{
        paddingVertical: 8
      }}
    />
  )

}

const styles = StyleSheet.create(theme => ({
  separator: {
    height: 4,
    opacity: 0
  }
}))
