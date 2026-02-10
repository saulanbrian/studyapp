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
  const { id } = useSummary()

  const handleRetry = useCallback(() => {
    updateSummary({
      id,
      fields: {
        status: "pending"
      }
    })
    requestSummary(id)
    modalDismissFn()
  }, [id])

  return (
    <ModalActionButton onPress={handleRetry}>
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
