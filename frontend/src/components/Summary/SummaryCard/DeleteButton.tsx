import { useCallback, useState } from "react";
import ModalActionButton from "./ModalActionButton";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "../../ThemedText";
import { useUnistyles } from "react-native-unistyles";
import ThemedAlert from "../../ThemedAlert";
import deleteSummary from "@/src/api/services/summaries/deleteSummary";
import { useSummary } from "@/src/context/Summary/SummaryContext";


type DeleteButtonProps = {
  modalDismissFn: () => void;
}

export default function DeleteButton({ modalDismissFn }: DeleteButtonProps) {

  const [alertVisible, setAlertVisible] = useState(false)
  const { colors } = useUnistyles().theme
  const { id } = useSummary()

  const handleDeletePress = useCallback(() => {
    setAlertVisible(true)
  }, [id])

  const handleDelete = useCallback(() => {
    deleteSummary(id)
    setAlertVisible(false)
    modalDismissFn()
  }, [id])

  return (
    <>
      <ModalActionButton
        onPress={handleDeletePress}
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
          onDispatch: handleDelete,
          warning: true
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
