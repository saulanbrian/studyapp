import { useSummary } from "@/src/context/Summary/SummaryContext";
import { SummaryNavigationProp } from "@/src/navigation/Summary/types";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import ThemedText from "../../ThemedText";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useCallback } from "react";

export default function ViewPdfButton() {

  const navigation = useNavigation<SummaryNavigationProp>()
  const { id } = useSummary()

  const handlePress = useCallback(() => {
    navigation.navigate("SummaryPdfView", { summaryId: id })
  }, [id])

  return (
    <Pressable onPress={handlePress}>
      <ThemedText style={styles.text}>view original file</ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create(theme => ({
  text: {
    color: theme.colors.info
  }
}))
