import { useGetQuizzes } from "@/api/queries/quiz";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import { ThemedText, ThemedView } from "@/components/ui";
import { summarizeInfiniteQueryResult } from "@/utils/query";
import { FlashList } from "@shopify/flash-list";

export default function UserQuizzes() {

  const { data, status } = useGetQuizzes()

  return (
    <SuspendedViewWithErrorBoundary style={{ flex: 1 }} status={status}>
      {data && (
        <FlashList
          data={summarizeInfiniteQueryResult(data)}
          keyExtractor={quiz => quiz.id}
          renderItem={({ item: quiz }) => {
            return (
              <ThemedText>quiz id:{quiz.id}</ThemedText>
            )
          }}
        />
      )}
    </SuspendedViewWithErrorBoundary>
  )
}



