import { SummaryNavigationProp } from "@/src/navigation/Summary/types"
import { useNavigation } from "@react-navigation/native"
import { useCallback } from "react"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
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
    <ModalActionButton
      onPress={handleOpen}
      style={styles.button}
    >
      <Ionicons
        name={"open-outline"}
        color={colors.textPrimary}
        size={24}
      />
      <ThemedText size={"md"} fw={"bold"}>
        read summary
      </ThemedText>
    </ModalActionButton>
  )
}

const styles = StyleSheet.create(theme => ({
  button: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    flexGrow: 1
  }
}))
