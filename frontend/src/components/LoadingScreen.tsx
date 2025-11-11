import { ActivityIndicator, View } from "react-native";
import ThemedScreen from "./ThemedScreen";
import { S } from "../constants/Styles";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useLayoutEffect } from "react";

export default function LoadingScreen() {
  return (
    <ThemedScreen style={S.centerContainer}>
      <ActivityIndicator size={50} />
    </ThemedScreen>
  )
}

const Loader = () => {

  return (
    <View style={styles.loaderContainer}>
      <Box pointX={-36} pointY={-36} />
      <Box pointX={36} pointY={-36} delay={50} />
      <Box pointX={-36} pointY={36} delay={100} />
      <Box pointX={36} pointY={36} delay={150} />
    </View>
  )
}

type BoxProps = {
  pointX: number;
  pointY: number;
  delay?: number;
}

const Box = ({ pointX, pointY, delay }: BoxProps) => {

  const { theme } = useUnistyles()
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const color = useSharedValue(theme.colors.primary)

  const rStyles = useAnimatedStyle(() => ({
    backgroundColor: color.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ]
  }))

  useLayoutEffect(() => {
    translateX.value = withDelay(delay ?? 0,
      withRepeat(
        withTiming(pointX, { duration: 500 }),
        -1,
        true
      )
    )
    translateY.value = withDelay(delay ?? 0,
      withRepeat(
        withTiming(pointY, { duration: 500 }),
        -1,
        true
      )
    )

  }, [])

  return <Animated.View style={[styles.box, rStyles]} />
}

const styles = StyleSheet.create(theme => ({
  box: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderContainer: {
    height: 36,
    width: 36
  }
}))
