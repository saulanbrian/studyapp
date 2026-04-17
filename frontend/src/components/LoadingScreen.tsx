import ThemedScreen from "./ThemedScreen";
import { S } from "../constants/Styles";
import LottieView from "lottie-react-native"
import { StyleSheet } from "react-native-unistyles";

export default function LoadingScreen() {
  return (
    <ThemedScreen style={S.centerContainer}>
      <LottieView
        source={require("@/assets/lotties/loader.json")}
        autoPlay
        style={styles.lottieView}
      />
    </ThemedScreen>
  )
}

const styles = StyleSheet.create(theme => ({
  lottieView: {
    height: 200,
    width: 200
  }
}))
