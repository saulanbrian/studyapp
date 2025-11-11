import { S } from "../constants/Styles";
import ThemedScreen from "./ThemedScreen";
import ThemedText from "./ThemedText";

export default function ErrorScreen() {
  return (
    <ThemedScreen style={S.centerContainer}>
      <ThemedText>an error has occured</ThemedText>
    </ThemedScreen>
  )
}
