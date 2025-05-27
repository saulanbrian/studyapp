import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

export default function ListEmptyComponent() {
  return (
    <LottieView
      source={require('@/assets/animation/empty.json')}
      style={styles.container}
      autoPlay
      loop
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
