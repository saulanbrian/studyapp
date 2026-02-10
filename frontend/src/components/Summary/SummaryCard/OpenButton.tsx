import { SummaryNavigationProp } from "@/src/navigation/Summary/types"
import { useNavigation } from "@react-navigation/native"
import { useCallback } from "react"
import { useUnistyles } from "react-native-unistyles"
import ModalActionButton from "./ModalActionButton"
import { Ionicons } from "@expo/vector-icons"
import ThemedText from "../../ThemedText"
import { useSummary } from "@/src/context/Summary/SummaryContext"


export default function OpenButton({ modalDismissFn }: { modalDismissFn: () => void }) {

  const { colors } = useUnistyles().theme
  const navigation = useNavigation<SummaryNavigationProp>()
  const { id } = useSummary()

  const handleOpen = useCallback(() => {
    navigation.navigate("SummaryDetail", { id })
    modalDismissFn()
  }, [id])

  return (
    <ModalActionButton onPress={handleOpen}>
      <Ionicons
        name={"open-outline"}
        color={colors.primary}
        size={24}
      />
      <ThemedText
        color={"themePrimary"}
        size={"xxs"}
      >
        open
      </ThemedText>
    </ModalActionButton>
  )
}
