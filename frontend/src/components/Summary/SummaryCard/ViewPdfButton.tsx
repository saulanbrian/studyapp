import { useSummary } from "@/src/context/Summary/SummaryContext";
import { SummaryNavigationProp } from "@/src/navigation/Summary/types";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import ThemedText from "../../ThemedText";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useCallback } from "react";
import ModalActionButton from "./ModalActionButton";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

export default function ViewPdfButton() {

  const navigation = useNavigation<SummaryNavigationProp>()
  const { colors } = useUnistyles().theme
  const { id } = useSummary()

  const handlePress = useCallback(() => {
    navigation.navigate("SummaryPdfView", { summaryId: id })
  }, [id])

  return (
    <ModalActionButton onPress={handlePress}>
      <FontAwesome
        name={"file-pdf-o"}
        size={20}
        color={colors.primary}
      />
      <ThemedText size={"xxs"} color={"themePrimary"}>
        view pdf
      </ThemedText>
    </ModalActionButton>
  )
}

