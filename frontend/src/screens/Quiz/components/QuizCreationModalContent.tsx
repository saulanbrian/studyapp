import { useGetSummaries } from "@/src/api/queries/summaries";
import { Summary } from "@/src/api/types/summary";
import { mapInfiniteDataResult } from "@/src/api/utils/mapInfiniteDataResult";
import { LoadingScreen, ThemedText, ThemedView } from "@/src/components";
import SummaryCard from "@/src/components/Summary/SummaryCard/SummaryCard";
import ThemedButton from "@/src/components/ThemedButton";
import TransparentModalView, { TransparentModalViewRef } from "@/src/components/TransparentModalView";
import SummaryContextProvider from "@/src/context/Summary/SummaryContext";
import { FlashList } from "@shopify/flash-list";
import { Suspense, useCallback, useRef, useState } from "react";
import { Dimensions, Pressable, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import GenerateQuizButton from "./GenerateQuizButton";
import { S } from "@/src/constants/Styles";


const MODAL_HEIGHT = Dimensions.get('window').height * 0.6
const MODAL_WIDTH = Dimensions.get('window').width * 0.8

export default function QuizCreationModalContent({
  toggle: toggleSelf
}: { toggle: () => void }) {

  const [selectedSummary, setSelectedSummary] = useState<Summary>()
  const modalRef = useRef<TransparentModalViewRef>(null)

  const handleSummaryPick = useCallback((summary: Summary) => {
    setSelectedSummary(summary)
    modalRef.current?.toggle()
  }, [selectedSummary])

  return (
    <ThemedView style={styles.quizGenerationContainer}>
      <SummaryInputButton
        selectedSummary={selectedSummary}
        onRemoveSummary={() => setSelectedSummary(undefined)}
        onPress={() => modalRef.current?.toggle()}
      />
      <GenerateQuizButton
        summaryId={selectedSummary?.id}
        onSettled={toggleSelf}
      />
      <TransparentModalView
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        ref={modalRef}
      >
        <SummaryPicker
          onPickSummary={handleSummaryPick}
        />
      </TransparentModalView>
    </ThemedView>
  )
}

const SummaryInputButton = ({
  selectedSummary,
  onRemoveSummary,
  onPress
}: {
  onPress: () => void,
  onRemoveSummary: () => void;
  selectedSummary?: Summary
}) => {

  if (selectedSummary) {
    return (
      <TouchableOpacity onPress={onRemoveSummary}>
        <SummaryContextProvider {...selectedSummary}>
          <SummaryCard />
        </SummaryContextProvider>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView style={styles.summaryInputButton} surface>
        <ThemedText
          fw={"bold"}
          size={"lg"}
          color={"secondary"}
        >
          Pick a Summary
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  )
}

const SummaryPicker = ({
  onPickSummary
}: { onPickSummary: (summary: Summary) => void }) => {

  return (
    <ThemedView style={styles.summaryListModalContainer}>
      <Suspense fallback={LoadingScreen()}>
        <SummaryList onPickSummary={onPickSummary} />
      </Suspense>
    </ThemedView>
  )
}

const SummaryList = ({
  onPickSummary
}: { onPickSummary: (summary: Summary) => void }) => {

  const { data } = useGetSummaries()

  return <FlashList
    data={mapInfiniteDataResult(data)}
    keyExtractor={summary => summary.id}
    renderItem={({ item }) => (
      <SummaryContextProvider {...item}>
        <Pressable
          style={{ opacity: item.quizId ? 0.5 : 1 }}
          disabled={!!item.quizId}
          onPress={() => onPickSummary(item)}
        >
          <SummaryCard />
        </Pressable>
      </SummaryContextProvider>
    )}
    estimatedItemSize={222}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    ListEmptyComponent={() => (
      <ThemedView style={[S.centerContainer, styles.listEmptyComponent]}>
        <ThemedText color={"secondary"} style={{ textAlign: "center" }}>
          You don't have a summary. create one to generate a quiz
        </ThemedText>
      </ThemedView>
    )}
  />
}


const styles = StyleSheet.create(theme => ({
  listEmptyComponent: {
    height: MODAL_HEIGHT * 0.8,
    width: MODAL_WIDTH / 1.5,
    alignSelf: "center"
  },
  quizGenerationContainer: {
    width: MODAL_WIDTH,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md
  },
  summaryListModalContainer: {
    width: MODAL_WIDTH,
    height: MODAL_HEIGHT,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md
  },
  separator: {
    height: 1
  },
  summaryInputButton: {
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    height: 160,
    justifyContent: "center",
    alignItems: "center"
  },
}))
