import createNewQuiz from "@/src/api/services/quizzes/createNewQuiz";
import { useSummary } from "@/src/context/Summary/SummaryContext";
import { useMutation } from "@tanstack/react-query";
import ModalActionButton from "./ModalActionButton";
import { FontAwesome } from "@expo/vector-icons";
import { darkColors } from "@/src/constants/ui/Colors";
import { StyleSheet } from "react-native-unistyles";
import { ActivityIndicator } from "react-native";
import ThemedText from "../../ThemedText";
import useQueryUpdater from "@/src/api/hooks/useQueryUpdater";
import { Summary } from "@/src/api/types/summary";
import { Quiz } from "@/src/api/types/Quiz";
import { useNavigation } from "expo-router";
import { RootNavigatorParamList } from "@/src/navigation/types";
import { NavigationProp } from "@react-navigation/native";

export default function CreateQuizButton({
  modalDismissFn
}: {
  modalDismissFn: () => void
}) {

  const { id } = useSummary()
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>()

  const {
    updateDataFromInfiniteQuery,
    insertIntoInfiniteQuery
  } = useQueryUpdater<Summary | Quiz>()

  const { mutate, isPending } = useMutation<Quiz>({
    mutationFn: async () => {
      const { data, error } = await createNewQuiz(id)
      if (error) throw error
      return {
        ...data,
        summaryTitle: data.summaries.title
      }
    },
    onSuccess: (quiz) => {
      updateDataFromInfiniteQuery({
        id,
        queryKey: ["summaries"],
        updateFields: { quizId: quiz.id }
      })
      insertIntoInfiniteQuery({
        newData: quiz,
        queryKey: ["quizzes"]
      })
      modalDismissFn()
      navigation.navigate("Quiz", {
        screen: "QuizList"
      })
    }
  })

  return (
    <ModalActionButton
      onPress={mutate}
      style={styles.button}
      disabled={isPending}
    >
      {isPending ? (
        <ActivityIndicator color={darkColors.textPrimary} />
      ) : (
        <>
          <FontAwesome
            name={"gears"}
            color={darkColors.textPrimary}
          />
          <ThemedText style={styles.buttonText}>
            Generate quiz
          </ThemedText>
        </>
      )}
    </ModalActionButton>
  )
}

const styles = StyleSheet.create(theme => ({
  button: {
    backgroundColor: theme.colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1
  },
  buttonText: {
    color: darkColors.textPrimary
  }
}))
