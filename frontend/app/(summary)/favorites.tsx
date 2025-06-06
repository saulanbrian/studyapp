import { useGetFavoriteSummaries } from "@/api/queries/summary"
import SummaryPreview from "@/components/SummaryPreview"
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary"
import { ListEmptyComponent, ThemedText, ThemedView } from "@/components/ui"
import { summarizeInfiniteQueryResult } from "@/utils/query"
import { FlashList } from "@shopify/flash-list"
import { StyleSheet, View } from "react-native"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { Summary } from "@/types/data"
import { SummaryBottomSheet } from "@/components"

export default function FavoriteSummaries() {

  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useGetFavoriteSummaries()
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const [selectedSummary, setSelectedSumarry] = useState<Summary | null>(null)


  const handleLongPress = useCallback((summary: Summary) => {
    setSelectedSumarry(summary)
  }, [selectedSummary])

  const summaries = useMemo(() => {
    return data && summarizeInfiniteQueryResult(data)
  }, [data])

  useEffect(() => {
    if (selectedSummary) {
      bottomSheetRef.current?.present()
    }
  }, [selectedSummary])


  return (
    <SuspendedViewWithErrorBoundary
      status={status}
      style={{ flex: 1 }}
      retryCallback={refetch}
    >
      <FlashList
        data={summaries}
        keyExtractor={item => item.id}
        renderItem={({ item: summary, index }) => (
          <SummaryPreview
            style={[
              {
                ...(
                  index % 2 === 0
                    ? { marginRight: 2 }
                    : { marginLeft: 2 }
                )
              },
              styles.summary
            ]}
            onLongPress={() => handleLongPress(summary)}
            delayLongPress={300}
            {...summary}
          />
        )}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        onEndReached={fetchNextPage}
        onRefresh={refetch}
        refreshing={isFetchingNextPage}
        ListEmptyComponent={<ListEmptyComponent />}
      />
      <SummaryBottomSheet
        onDismiss={() => setSelectedSumarry(null)}
        ref={bottomSheetRef}
        selectedSummary={selectedSummary}
      />
    </SuspendedViewWithErrorBoundary>
  )
}


const styles = StyleSheet.create({
  summary: {
    flexGrow: 1,
    marginVertical: 2
  }
})
