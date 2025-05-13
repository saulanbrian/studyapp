import React, { Suspense, useEffect, useMemo } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { AntDesign } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import { useUploadFileToSummarize } from '@/api/mutations/summary'
import { Card, FeatherFab, ThemedText, ThemedView } from "@/components/ui";
import { FlashList } from '@shopify/flash-list'
import { useGetSummaries } from "@/api/queries/summary";
import { summarizeInfiniteQueryResult } from "@/utils/query";
import SuspendedViewWithErrorBoundary from "@/components/SuspendedViewWithErrorBoundary";
import SummaryPreview from "@/components/SummaryPreview";
import { useRouter } from "expo-router";

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

  const summaries = useMemo(() => {
    return data && summarizeInfiniteQueryResult(data)
  }, [data])

  return (
    <SuspendedViewWithErrorBoundary status={status} style={{ flex: 1 }}>
      {summaries && (
        <FlashList
          data={summaries}
          keyExtractor={item => item.id}
          renderItem={({ item: summary, index: i }) => (
            <View style={{
              flex: 1,
              paddingHorizontal: 8,
              paddingVertical: 2,
              ...(i % 2 === 0
                ? { paddingRight: 2 }
                : { paddingLeft: 2 })
            }}>
              <SummaryPreview {...summary} />
            </View>
          )}
          numColumns={2}
          refreshing={isRefetching}
          onRefresh={refetch}
          estimatedItemSize={253}
        />
      )}
    </SuspendedViewWithErrorBoundary>
  )
}

const uploadSequence = {
  getDocument: async () => {
    const result = await DocumentPicker.getDocumentAsync()
    return result?.canceled ? null : result.assets[0]
  },
  getDocumentExtension: async (asset: DocumentPicker.DocumentPickerAsset) => {
    const splittedName = asset.name.split('.')
    return splittedName.length > 1
      ? splittedName[splittedName.length - 1]
      : ''
  },

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Index;
