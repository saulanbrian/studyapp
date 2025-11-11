import { forwardRef, useRef } from "react";
import { View, ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

type ThemedViewProps = ViewProps & (
  | { surface?: boolean, elevated?: never }
  | { elevated?: boolean, surface?: never }
)

const ThemedView = forwardRef<View, ThemedViewProps>(({
  style,
  surface,
  elevated,
  ...props
}, ref) => {

  styles.useVariants({
    bg: surface ? "surface" : elevated ? "elevated" : undefined
  })

  return <View style={[styles.container, style]} {...props} ref={ref} />
})

export const AnimatedThemedView = Animated.createAnimatedComponent(ThemedView)
export default ThemedView

const styles = StyleSheet.create(theme => ({
  container: {
    variants: {
      bg: {
        surface: {
          backgroundColor: theme.colors.surface,
        },
        elevated: {
          backgroundColor: theme.colors.elevated
        },
        default: {
          backgroundColor: theme.colors.background
        }
      }
    }
  }
}))


