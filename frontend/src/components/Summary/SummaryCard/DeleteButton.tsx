import { useCallback, useState } from "react";
import ModalActionButton from "./ModalActionButton";
import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "../../ThemedText";
import { useUnistyles } from "react-native-unistyles";
import ThemedAlert from "../../ThemedAlert";
import deleteSummary from "@/src/api/services/summaries/deleteSummary";
import { useSummary } from "@/src/context/Summary/SummaryContext";
import useQueryUpdater from "@/src/api/hooks/useQueryUpdater";
import { useMutation } from "@tanstack/react-query";
import { darkColors } from "@/src/constants/ui/Colors";
import { Summary } from "@/src/api/types/summary";
import { Quiz } from "@/src/api/types/Quiz";


type DeleteButtonProps = {
  modalDismissFn: () => void;
}

export default function DeleteButton({ modalDismissFn }: DeleteButtonProps) {

  const [alertVisible, setAlertVisible] = useState(false)
  const { colors } = useUnistyles().theme
  const { id, quizId } = useSummary()
  const { removeDataFromInfiniteQuery } = useQueryUpdater<Quiz>()

  const {
    mutate,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      const { error, data } = await deleteSummary(id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      if (quizId) {
        removeDataFromInfiniteQuery({
          id: quizId,
          queryKey: ["quizzes"]
        })
      }
      setAlertVisible(false)
      modalDismissFn()
    }
  })


  return (
    <>
      <ModalActionButton
        onPress={() => setAlertVisible(true)}
        disabled={isPending}
      >
        <Ionicons
          name={"trash-bin"}
          size={24}
          color={colors.error}
        />
        <ThemedText
          size={"xxs"}
          color={"error"}
        >
          delete
        </ThemedText>
      </ModalActionButton>
      <ThemedAlert
        visible={alertVisible}
        title={"summary deletion confirmation"}
        text="are you sure you want to delete this summary?"
        primaryAction={{
          title: "delete",
          onDispatch: mutate,
          warning: true,
          isPending
        }}
        secondaryAction={{
          title: "cancel",
          onDispatch: () => {
            setAlertVisible(false)
          }
        }}
      />
    </>
  )
}
