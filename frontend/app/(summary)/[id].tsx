import { useGetSummary } from "@/api/queries/summary";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import { ThemedText, ThemedView } from "@/components/ui";
import { Summary } from "@/types/data";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

export default function DetailedSummary() {

  const navigation = useNavigation()
  const { id } = useLocalSearchParams()
  const { status, data } = useGetSummary(id as string)

  useEffect(() => {
    if (data) {
      navigation.setOptions({
        headerTitle: data.title
      })
      console.log(data)
    }
  }, [data])

  return (
    <SuspendedViewWithErrorBoundary style={{ flex: 1 }} status={status}>
      <ThemedText>{data?.content || 'none'}</ThemedText>
    </SuspendedViewWithErrorBoundary>
  )

}
