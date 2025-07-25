import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { AntDesign } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import { useUploadFileToSummarize } from '@/api/mutations/summary'
import { Card, FeatherFab, ListEmptyComponent, ThemedText, ThemedView } from "@/components/ui";
import { FlashList } from '@shopify/flash-list'
import { useGetSummaries } from "@/api/queries/summary";
import { summarizeInfiniteQueryResult } from "@/utils/query";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import SummaryPreview from "@/components/SummaryPreview";
import { SummaryBottomSheet } from '@/components'
import { useRouter } from "expo-router";
import { Summary } from "@/types/data";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AnimatedThemedView } from "@/components/ui/ThemedView";
import { FadeIn } from "react-native-reanimated";

const Index = () => {

  const { mutate } = useUploadFileToSummarize()
  const router = useRouter()

  const handlePress = async () => {
    router.navigate('/(summary)/create')
  }

  return (
    <AnimatedThemedView
      entering={FadeIn.duration(1000)}
      style={styles.container}
    >
      <SummaryList />
      <FeatherFab
        onPress={handlePress}
        icon={"plus"}
        size={20}
        label="create"
      />
    </AnimatedThemedView>
  );
};


const SummaryList = () => {

  const { status, data, refetch, isRefetching, fetchNextPage } = useGetSummaries()
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const summaries = useMemo(() => {
    return data && summarizeInfiniteQueryResult(data)
  }, [data])

  const handleLongPress = useCallback((summary: Summary) => {
    setSelectedSummary(summary)
  }, [selectedSummary])

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
        renderItem={({ item: summary, index: i }) => (
          <SummaryPreview
            style={[
              {
                ...(
                  i % 2 === 0
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
        refreshing={isRefetching}
        onRefresh={refetch}
        estimatedItemSize={253}
        onEndReached={fetchNextPage}
        contentContainerStyle={{ padding: 8 }}
        ListEmptyComponent={<ListEmptyComponent />}
      />
      <SummaryBottomSheet
        selectedSummary={selectedSummary}
        onDismiss={() => setSelectedSummary(null)}
        ref={bottomSheetRef}
      />
    </SuspendedViewWithErrorBoundary>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summary: {
    flexGrow: 1,
    marginVertical: 2
  }
});

export default Index;
