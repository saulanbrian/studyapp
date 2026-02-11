import { Ionicons } from "@expo/vector-icons";
import ModalActionButton, { ModalActionButtonProps } from "./ModalActionButton";
import { darkColors } from "@/src/constants/ui/Colors";
import ThemedText from "../../ThemedText";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useMutation } from "@tanstack/react-query";
import createNewQuiz from "@/src/api/services/quizzes/createNewQuiz";
import { ActivityIndicator, Alert } from "react-native";
import { Quiz } from "@/src/api/types/Quiz";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import useQueryUpdater from "@/src/api/hooks/useQueryUpdater";
import processQuiz from "@/src/api/services/quizzes/processQuiz";
import { useCallback, useEffect, useState } from "react";
import { RootNavigatorParamList } from "@/src/navigation/types";
import { useGetQuizBySummaryId } from "@/src/api/queries/quizzes";
import { useSummary } from "@/src/context/Summary/SummaryContext";

type PlayQuizButtonProps = Pick<ModalActionButtonProps, "style"> & {
  modalDismissFn: () => void;
}

export default function PlayQuizButton({
  modalDismissFn,
  style
}: PlayQuizButtonProps) {

  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>()
  const { id } = useSummary()

  const {
    data: quiz,
    isPending,
    error
  } = useGetQuizBySummaryId(id)

  const handlePress = useCallback(() => {
    if (error) throw error
    if (quiz?.status === "success") {
      navigation.navigate("Quiz", {
        screen: "QuizPlayScreen",
        params: { id: quiz.id }
      })
    } else {
      navigation.navigate("Quiz", {
        screen: "QuizList"
      })
    }
    modalDismissFn()
  }, [quiz])

  return (
    <ModalActionButton
      style={[styles.button, style]}
      disabled={isPending}
      onPress={handlePress}
    >
      {isPending ? (
        <ActivityIndicator color={darkColors.textPrimary} />
      ) : <>
        <Ionicons
          name={"play"}
          size={24}
          color={darkColors.textPrimary}
        />
        <ThemedText style={styles.buttonText}>
          Play Quiz
        </ThemedText>
      </>
      }
    </ModalActionButton>
  )

}

const styles = StyleSheet.create(theme => ({
  button: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1
  },
  buttonText: {
    color: darkColors.textPrimary
  }
}))
