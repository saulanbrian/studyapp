import { requestSummary } from "@/src/api/services/summaries"
import updateSummary from "@/src/api/services/summaries/updateSummary"
import { Ionicons } from "@expo/vector-icons"
import { useCallback } from "react"
import { useUnistyles } from "react-native-unistyles"
import ModalActionButton from "./ModalActionButton"
import ThemedText from "../../ThemedText"
import { useSummary } from "@/src/context/Summary/SummaryContext"




export default function RetryButton({
  modalDismissFn
}: {
  modalDismissFn: () => void
}) {

  const { colors } = useUnistyles().theme
  const { id, status } = useSummary()

  const handleRetry = useCallback(async () => {
    const { data, error } = await updateSummary({
      id,
      fields: {
        status: "pending"
      }
    })
    if (error) throw error
    requestSummary(data.id)
    modalDismissFn()
  }, [id])

  return (
    <ModalActionButton
      onPress={handleRetry}
      disabled={status !== "error"}
    >
      <Ionicons
        name={"reload"}
        size={24}
        color={colors.warning}
      />
      <ThemedText
        color={"warning"}
        size={"xxs"}
      >
        retry
      </ThemedText>
    </ModalActionButton>
  )
}
