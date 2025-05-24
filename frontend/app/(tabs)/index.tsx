import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { AntDesign } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import { useUploadFileToSummarize } from '@/api/mutations/summary'
import { Card, FeatherFab, ThemedText, ThemedView } from "@/components/ui";
import { FlashList } from '@shopify/flash-list'
import { useGetSummaries } from "@/api/queries/summary";
import { summarizeInfiniteQueryResult } from "@/utils/query";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import SummaryPreview from "@/components/SummaryPreview";
import { SummaryBottomSheet } from '@/components'
import { useRouter } from "expo-router";
import { Summary } from "@/types/data";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const Index = () => {

  const { mutate } = useUploadFileToSummarize()
  const router = useRouter()

  const handlePress = async () => {
    router.navigate('/(summary)/create')
  }

  return (
    <ThemedView style={styles.container}>
      <SummaryList />
      <FeatherFab
        onPress={handlePress}
        icon={"plus"}
        size={20}
        label="create"
      />
    </ThemedView>
  );
};


const SummaryList = () => {

  const { status, data, refetch, isRefetching } = useGetSummaries()
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const summaries = useMemo(() => {
    return data && summarizeInfiniteQueryResult(data)
  }, [data])

  const handleLongPress = (summary: Summary) => {
    setSelectedSummary(summary)
    bottomSheetRef.current?.present()
  }

  return (
    <SuspendedViewWithErrorBoundary status={status} style={{ flex: 1 }}>
      {summaries && (
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
              {...summary}
            />
          )}
          numColumns={2}
          refreshing={isRefetching}
          onRefresh={refetch}
          estimatedItemSize={253}
          contentContainerStyle={{ padding: 8 }}
        />
      )}
      <SummaryBottomSheet
        onClose={() => setSelectedSummary(null)}
        selectedSummary={selectedSummary}
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
