import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";

export default function ListEmptyComponent() {
  return (
    <ThemedView style={styles.container}>
      <LottieView
        source={require('@/assets/animation/empty.json')}
        style={styles.lottieView}
        autoPlay
        loop
      />
      <ThemedText style={styles.text}>Nothing here...</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60
  },
  lottieView: {
    height: 280,
    width: 280,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
  }
})
