import { useGetSummaries } from "@/src/api/queries/summaries";
import { mapInfiniteDataResult } from "@/src/api/utils/mapInfiniteDataResult";
import { ErrorScreen, LoadingScreen, ThemedScreen, ThemedText, ThemedView } from "@/src/components";
import SummaryComponent from "@/src/components/Summary/SummaryComponent";
import ThemedButton, { AnimatedThemedButton } from "@/src/components/ThemedButton";
import { SummaryStackParamList } from "@/src/navigation/Summary/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Suspense, useCallback } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function SummaryListScreen() {

  const navigation = useNavigation<NavigationProp<SummaryStackParamList>>()

  const handlePress = useCallback(() => {
    navigation.navigate("SummaryCreation")
  }, [])

  return (
    <ThemedScreen style={{ flex: 1 }}>
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
  const summaries = mapInfiniteDataResult(data)

  return (
    <FlashList
      data={summaries}
      keyExtractor={item => item.id}
      refreshing={isRefetching}
      onRefresh={refetch}
      showsVerticalScrollIndicator={false}
      onEndReached={() => hasNextPage && fetchNextPage()}
      estimatedItemSize={123}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item, index }) => (
        <SummaryComponent
          style={index === 0
            ? styles.initialSummary
            : undefined
          }
          {...item}
        />
      )}
    />
  )
}


const Header = () => {

  return (
    <ThemedText
      fw={"bold"}
      size={"lg"}
      style={styles.header}
    >
      Summaries
    </ThemedText>
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
    height: 4
  },
  summaryContainer: {
    padding: theme.spacing.sm
  },
}))
