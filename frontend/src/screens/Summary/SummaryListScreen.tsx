import { useGetSummaries } from "@/src/api/queries/summaries";
import { mapInfiniteDataResult } from "@/src/api/utils/mapInfiniteDataResult";
import { ErrorScreen, LoadingScreen, ThemedScreen, ThemedText, ThemedView } from "@/src/components";
import ThemedButton, { AnimatedThemedButton } from "@/src/components/ThemedButton";
import { SummaryStackParamList } from "@/src/navigation/Summary/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Suspense, useCallback, useEffect } from "react";
import { View } from "react-native";
import SummaryCard from "@/src/components/Summary/SummaryCard"
import { StyleSheet } from "react-native-unistyles";

export default function SummaryListScreen() {

  const navigation = useNavigation<NavigationProp<SummaryStackParamList>>()

  const handlePress = useCallback(() => {
    navigation.navigate("SummaryCreation")
  }, [])

  return (
    <ThemedScreen style={{ flex: 1, paddingHorizontal: 0 }}>
      <Suspense fallback={<LoadingScreen />}>
        <SummaryList />
      </Suspense>
      <ThemedButton
        title={"summarize"}
        style={styles.fab}
        onPress={handlePress}
      />
    </ThemedScreen>
  )

}


const SummaryList = () => {

  const {
    data,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching
  } = useGetSummaries()

  return (
    <FlashList
      data={mapInfiniteDataResult(data)}
      keyExtractor={item => item.id}
      refreshing={isRefetching}
      onRefresh={refetch}
      showsVerticalScrollIndicator={false}
      onEndReached={() => hasNextPage && fetchNextPage()}
      estimatedItemSize={123}
      decelerationRate={0.5}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <SummaryCard {...item} />
      )}
      contentContainerStyle={{ paddingHorizontal: 12 }}
    />
  )
}


const styles = StyleSheet.create(theme => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing.lg,
    right: theme.spacing.md,
    borderRadius: theme.radii.pill
  },
  initialSummary: {
    marginTop: 8
  },
  header: {
    marginTop: theme.spacing.md,
    letterSpacing: 1.5
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "transparent"
  },
  separator: {
    height: 6
  },
  summaryContainer: {
    padding: theme.spacing.sm
  },
}))
