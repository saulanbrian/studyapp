import { useGetFavoriteSummaries } from "@/api/queries/summary"
import SummaryPreview from "@/components/SummaryPreview"
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary"
import { ThemedText, ThemedView } from "@/components/ui"
import { summarizeInfiniteQueryResult } from "@/utils/query"
import { FlashList } from "@shopify/flash-list"
import { StyleSheet, View } from "react-native"
import { useRef, useState } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { Summary } from "@/types/data"
import { SummaryBottomSheet } from "@/components"

export default function FavoriteSummaries() {

  const { data, status, refetch } = useGetFavoriteSummaries()
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const [selectedSummary, setSelectedSumarry] = useState<Summary | null>(null)


  const handleLongPress = (summary: Summary) => {
    setSelectedSumarry(summary)
    bottomSheetRef.current?.present()
  }

  return (
    <SuspendedViewWithErrorBoundary
      status={status}
      style={{ flex: 1 }}
      retryCallback={refetch}
    >
      {data && (
        <FlashList
          data={summarizeInfiniteQueryResult(data)}
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
              {...summary}
            />
          )}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
        />
      )}
      <SummaryBottomSheet
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
