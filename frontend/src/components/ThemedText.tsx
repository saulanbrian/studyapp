import { Text, TextProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type ThemedTextProps = TextProps & {
  color?:
  | "primary"
  | "secondary"
  | "tertiary"
  | "disabled"
}

export default function ThemedText({
  style,
  color = "primary",
  ...props
}: ThemedTextProps) {

  styles.useVariants({ color })

  return <Text style={[styles.text, style]} {...props} />

}

const styles = StyleSheet.create(theme => ({
  text: {
    fontSize: 16,
    variants: {
      color: {
        primary: {
          color: theme.colors.textPrimary
        },
        secondary: {
          color: theme.colors.textSecondary
        },
        tertiary: {
          color: theme.colors.textTertiary
        },
        disabled: {
          color: theme.colors.textDisabled
        }
      }
    }
  }
}))
