import { ActivityIndicator } from "react-native";
import ThemedScreen from "./ThemedScreen";
import { S } from "../constants/Styles";

export default function LoadingScreen() {
  return (
    <ThemedScreen style={S.centerContainer}>
      <ActivityIndicator />
    </ThemedScreen>
  )
}
