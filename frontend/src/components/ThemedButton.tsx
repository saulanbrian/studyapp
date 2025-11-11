import { ComponentType, useState } from "react";
import { Pressable, PressableProps, StyleProp, Text, TextProps, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import ThemedText from "./ThemedText";
import Animated from "react-native-reanimated";


export type ThemedButtonProps = PressableProps & {
  title: string;
  size?: "sm" | "md" | "lg"
  color?:
  | "primary"
  | "secondary"
  | "error";
  textStyle?: TextProps["style"]
}

export default function ThemedButton({
  disabled,
  title,
  style,
  size,
  color = "primary",
  onPressIn,
  onPressOut,
  textStyle,
  children,
  ...props
}: ThemedButtonProps) {

  const [isPressed, setIsPressed] = useState(false)

  styles.useVariants({
    color,
    pressed: isPressed,
    size,
    disabled: disabled ?? false
  })

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
      {children ?? (
        <ThemedText
          style={[styles.text, textStyle]}
          size={size && size}
        >
          {title}
        </ThemedText>
      )}
    </Pressable>
  )
}

export const AnimatedThemedButton = Animated.createAnimatedComponent(ThemedButton)

const styles = StyleSheet.create(theme => ({
  button: {
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
      },
      size: {
        sm: {
          padding: theme.spacing.sm
        },
        md: {
          padding: theme.spacing.md
        },
        lg: {
          padding: theme.spacing.lg
        },
        default: {
          padding: theme.spacing.md
        }
      },
      disabled: {
        true: {
          backgroundColor: theme.colors.primaryLight,
          opacity: 0.7
        },
        default: {}
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
