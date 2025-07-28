import { useState } from "react";
import { Pressable, PressableProps, StyleProp, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import ThemedText from "./ThemedText";
import Animated from "react-native-reanimated";

type ThemedButtonProps = PressableProps & {
  title: string;
  color?:
  | "primary"
  | "secondary"
  | "error"
}

export default function ThemedButton({
  disabled,
  title,
  style,
  color = "primary",
  onPressIn,
  onPressOut,
  ...props
}: ThemedButtonProps) {

  const [isPressed, setIsPressed] = useState(false)

  styles.useVariants({ color, pressed: isPressed })

  return (
    <Pressable
      style={pressed => [
        styles.button,
        style && typeof style === 'function'
          ? style(pressed)
          : style
      ]}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      {...props}
    >
      <ThemedText style={styles.text}>{title}</ThemedText>
    </Pressable>
  )
}

export const AnimatedThemedButton = Animated.createAnimatedComponent(ThemedButton)

const styles = StyleSheet.create(theme => ({
  button: {
    padding: theme.spacing.md,
    borderRadius: theme.radii.sm,
    variants: {
      color: {
        primary: {
          backgroundColor: theme.colors.primary
        },
        secondary: {
          backgroundColor: theme.colors.secondary
        },
        error: {
          backgroundColor: theme.colors.error
        }
      },
      pressed: {
        true: {
          transform: [
            { scale: 0.98 }
          ]
        },
        false: {

        }
      }
    },
    compoundVariants: [
      {
        color: "primary",
        pressed: true,
        styles: {
          backgroundColor: theme.colors.primaryDark
        }
      },
      {
        color: "secondary",
        pressed: true,
        styles: {
          backgroundColor: theme.colors.secondaryDark
        }
      }
    ]
  },
  text: {
    color: theme.colors.buttonText
  }
}))
