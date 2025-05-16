import { useGetQuiz } from "@/api/queries/quiz";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import { ThemedText } from "@/components/ui";
import { useLocalSearchParams } from "expo-router";

export default function QuizPage() {

  const { id } = useLocalSearchParams()
  const { status, data } = useGetQuiz(id as string)

  return (
    <SuspendedViewWithErrorBoundary status={status}>
      <ThemedText>{data!.id}</ThemedText>
    </SuspendedViewWithErrorBoundary>
  )
}
