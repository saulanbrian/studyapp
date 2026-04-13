import { useGetInfiniteQuiz } from "@/src/api/queries/quizzes";
import { mapInfiniteDataResult } from "@/src/api/utils/mapInfiniteDataResult";
import { EmptyQueryScreen, LoadingScreen, ThemedScreen, ThemedText, ThemedView, TransparentModalView } from "@/src/components";
import QuizCard from "@/src/components/Quiz/QuizCard";
import ThemedButton from "@/src/components/ThemedButton";
import { TransparentModalViewRef } from "@/src/components/TransparentModalView";
import { QuizStackParamList } from "@/src/navigation/Quiz/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import QuizCreationModalContent from "./components/QuizCreationModalContent";

export default function QuizListScreen() {

  const modalRef = useRef<TransparentModalViewRef>(null)

  return (
    <ThemedScreen>
      <Suspense fallback={LoadingScreen()}>
        <Quizzes />
      </Suspense>
      <ThemedButton
        title={"create quiz"}
        style={styles.fab}
        onPress={() => {
          modalRef.current?.toggle()
        }}
      />
      <TransparentModalView ref={modalRef}>
        <QuizCreationModalContent toggle={() => modalRef.current?.toggle()} />
      </TransparentModalView>
    </ThemedScreen>
  )
}

const Quizzes = () => {

  const {
    data,
    refetch,
    isRefetching
  } = useGetInfiniteQuiz()

  const { params } = useRoute<RouteProp<QuizStackParamList, 'QuizList'>>()
  const [selectedQuiz, setSelectedQuiz] = useState<string | undefined>()
  const [height, setHeight] = useState(0)

  const quizzes = useMemo(() => {
    return mapInfiniteDataResult(data)
  }, [data])

  useEffect(() => {
    setSelectedQuiz(params?.select)
  }, [params])

  return (
    <FlashList
      data={quizzes}
      extraData={selectedQuiz}
      keyExtractor={item => item.id}
      onRefresh={refetch}
      refreshing={isRefetching}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <QuizCard
          onPress={() => { setSelectedQuiz(item.id) }}
          selected={selectedQuiz === item.id ? true : false}
          {...item}
        />
      )}
      estimatedItemSize={80}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={{
        paddingVertical: 8
      }}
      onLayout={e => setHeight(e.nativeEvent.layout.height)}
      ListEmptyComponent={EmptyComponent({ height })}
    />
  )
}

const EmptyComponent = ({ height }: { height: number }) => {
  return (
    <EmptyQueryScreen
      queryName={"quiz"}
      style={{ height }}
    >
      <EmptyQueryScreen.Message />
    </EmptyQueryScreen>
  )
}

const styles = StyleSheet.create(theme => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing.lg,
    right: theme.spacing.md,
    borderRadius: theme.radii.pill,
  },
  separator: {
    height: 4,
    opacity: 0
  }
}))
