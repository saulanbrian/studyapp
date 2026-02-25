import { S } from "@/src/constants/Styles";
import { ActivityIndicator, View } from "react-native";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";
import { StyleSheet } from "react-native-unistyles";

export default function ProgressSavingView() {
  return (
    <ThemedView style={[S.centerContainer, styles.view]}>
      <ThemedText>saving result...</ThemedText>
      <ActivityIndicator />
    </ThemedView>
  )
}

const styles = StyleSheet.create(theme => ({
  view: {
    backgroundColor: theme.colors.primaryLight
  }
}))
