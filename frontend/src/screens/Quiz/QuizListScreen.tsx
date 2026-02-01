import { useGetInfiniteQuiz } from "@/src/api/queries/quizzes";
import { mapInfiniteDataResult } from "@/src/api/utils/mapInfiniteDataResult";
import { LoadingScreen, ThemedScreen, ThemedText } from "@/src/components";
import QuizCard from "@/src/components/Quiz/QuizCard";
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

  const { data: quizzes } = useGetInfiniteQuiz()

  return (
    <FlashList
      data={mapInfiniteDataResult(quizzes)}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <QuizCard {...item} />
      )}
      contentContainerStyle={{
        paddingVertical: 8
      }}
    />
  )

}
