import { S } from "@/src/constants/Styles";
import { ActivityIndicator, View } from "react-native";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";

export default function ProgressSavingView() {
  return (
    <ThemedView style={S.centerContainer}>
      <ThemedText>saving result...</ThemedText>
      <ActivityIndicator />
    </ThemedView>
  )
}
