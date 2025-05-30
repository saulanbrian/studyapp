import LottieView from "lottie-react-native"
import ThemedView from "./ThemedView"
import { StyleSheet, TouchableOpacity, View, ViewProps } from "react-native"
import { useThemeContext } from "@/context/Theme"
import ThemedText from "./ThemedText"

export default function ErrorView({
  retryCallback,
  style,
  ...props
}:
  { retryCallback: () => void } & ViewProps
) {

  const { theme } = useThemeContext()

  return (
    <ThemedView style={[styles.container, style]} {...props}>
      <LottieView
        source={require('@/assets/animation/error.json')}
        style={styles.lottieView}
        autoPlay
        loop
      />
      <TouchableOpacity
        style={[
          { borderColor: theme.textPrimary, borderWidth: 1 },
          styles.button
        ]}
        onPress={retryCallback}
      >
        <ThemedText>try again</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )

}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 8
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 200
  },
  lottieView: {
    height: 180,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
