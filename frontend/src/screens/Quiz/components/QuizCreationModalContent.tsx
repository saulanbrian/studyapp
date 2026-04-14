import { useGetSummaries } from "@/src/api/queries/summaries";
import { Summary } from "@/src/api/types/summary";
import { mapInfiniteDataResult } from "@/src/api/utils/mapInfiniteDataResult";
import { LoadingScreen, ThemedText, ThemedView } from "@/src/components";
import SummaryCardBase from "@/src/components/Summary/SummaryCard/SummaryCardBase";
import TransparentModalView, { TransparentModalViewRef } from "@/src/components/TransparentModalView";
import SummaryContextProvider from "@/src/context/Summary/SummaryContext";
import { FlashList } from "@shopify/flash-list";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, Pressable, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import GenerateQuizButton from "./GenerateQuizButton";
import { S } from "@/src/constants/Styles";


const SUMMARY_CREATION_NOTES = [
  "only 1 quiz can be generated for each summary",
  "summary status must be success / \"ready to view\" "
]

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
      <View>
        <ThemedText
          size={"xs"}
          color={"secondary"}
        >
          Note:
        </ThemedText>
        {SUMMARY_CREATION_NOTES.map((note, i) => (
          <ThemedText
            size={"xs"}
            color={"secondary"}
            key={i.toString()}
          >
            {`${i + 1}. ${note}`}
          </ThemedText>
        ))}
      </View>
      <TransparentModalView ref={modalRef}>
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
          <SummaryCardBase />
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
  const summaries = useMemo(() => {
    return mapInfiniteDataResult(data)
  }, [data])

  return <FlashList
    data={summaries}
    keyExtractor={summary => summary.id}
    renderItem={({ item }) => (
      <SummaryContextProvider {...item}>
        <Pressable
          style={{
            opacity:
              (item.quizId || item.status !== "success")
                ? 0.5
                : 1
          }}
          disabled={!!item.quizId || item.status !== "success"}
          onPress={() => onPickSummary(item)}
        >
          <SummaryCardBase />
        </Pressable>
      </SummaryContextProvider>
    )}
    estimatedItemSize={222}
    showsVerticalScrollIndicator={false}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    ListEmptyComponent={() => (
      <ThemedView style={[S.centerContainer, styles.listEmptyComponent]}>
        <ThemedText color={"secondary"} style={{ textAlign: "center" }}>
          You don't have a summary. create one to generate a quiz
        </ThemedText>
      </ThemedView>
    )}
    ListFooterComponent={() => summaries.length >= 1 && (
      <ThemedText
        size={"sm"}
        color={"tertiary"}
        style={styles.endMessage}
      >
        No more summaries
      </ThemedText>
    )}
  />
}


const styles = StyleSheet.create(theme => ({
  endMessage: {
    alignSelf: 'center',
    padding: theme.spacing.sm
  },
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
  summaryListNote: {
    marginBottom: theme.spacing.xs
  },
  separator: {
    height: 2
  },
  summaryInputButton: {
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    height: 160,
    justifyContent: "center",
    alignItems: "center"
  },
}))
