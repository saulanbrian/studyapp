import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

const INITIAL_ANIMATION_DURATION = 500

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export type ModalActionButtonProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean
}>

export default function ModalActionButton({
  style,
  onPress,
  disabled,
  children,
}: ModalActionButtonProps) {

  const scale = useSharedValue(0)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  styles.useVariants({ disabled })

  const rStyles = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(scale.value)
      }
    ]
  }))

  const handleLayout = useCallback(() => {
    timeout.current = setTimeout(() => {
      scale.value = 1
    }, INITIAL_ANIMATION_DURATION)
  }, [])

  useEffect(() => {

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }

  }, [])

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => scale.value = 0.93}
      onPressOut={() => scale.value = 1}
      onLayout={() => handleLayout()}
      style={[styles.button, rStyles, style]}
      disabled={disabled}
    >
      {children}
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create(theme => ({
  button: {
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radii.xs,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    width: 60,
    variants: {
      disabled: {
        true: {
          opacity: 0.6
        },
        default: {

        }
      }
    }
  }
}))
