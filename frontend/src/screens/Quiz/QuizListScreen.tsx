import { useGetInfiniteQuiz } from "@/src/api/queries/quizzes";
import { mapInfiniteDataResult } from "@/src/api/utils/mapInfiniteDataResult";
import { LoadingScreen, ThemedScreen, ThemedText } from "@/src/components";
import { FlashList } from "@shopify/flash-list";
import { Suspense } from "react";

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

  const { data: quiizes } = useGetInfiniteQuiz()

  return (
    <FlashList
      data={mapInfiniteDataResult(quiizes)}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ThemedText>{item.id}</ThemedText>
      )}
    />
  )

}
