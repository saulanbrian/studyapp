import LottieView, { LottieViewProps } from "lottie-react-native";
import { StyleSheet, useColorScheme, View } from "react-native";
import ThemedText from "./ThemedText";

type LoaderProps = Omit<LottieViewProps, 'source'> & {
  showText?: boolean
}

export default function Loader({
  style,
  showText,
  ...props
}: LoaderProps) {

  const theme = useColorScheme()

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <LottieView
        source={
          theme === 'dark'
            ? require('@/assets/animation/loader-white.json')
            : require('@/assets/animation/loader-dark.json')
        }
        autoPlay
        loop
        style={[styles.container, style]}
        {...props}
      />
      <ThemedText
        style={[{ opacity: showText ? 1 : 0 }, styles.text]}
      >
        loading...
      </ThemedText>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: 280,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    position: 'absolute',
    bottom: 40,
    fontSize: 20,
    paddingLeft: 16,
    letterSpacing: 2,
  }
})
