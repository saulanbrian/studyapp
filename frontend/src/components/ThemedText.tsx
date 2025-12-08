import { Text, TextProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type ThemedTextProps = TextProps & {
  color?:
  | "primary"
  | "secondary"
  | "tertiary"
  | "disabled"
  | "error"
  | "buttonText"
  | "warning"
  | "themePrimary"
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  fw?: "regular" | "medium" | "semiBold" | "bold"
}

export default function ThemedText({
  style,
  color = "primary",
  size,
  fw,
  ...props
}: ThemedTextProps) {

  styles.useVariants({ color, size, fw })

  return <Text style={[styles.text, style]} {...props} />

}

const styles = StyleSheet.create(theme => ({
  text: {
    variants: {
      color: {
        primary: { color: theme.colors.textPrimary },
        secondary: { color: theme.colors.textSecondary },
        tertiary: { color: theme.colors.textTertiary },
        disabled: { color: theme.colors.textDisabled },
        buttonText: { color: theme.colors.buttonText },
        error: { color: theme.colors.error },
        warning: { color: theme.colors.warning },
        themePrimary: { color: theme.colors.primary }
      },
      size: {
        xxs: { fontSize: theme.fontSize.xxs },
        xs: { fontSize: theme.fontSize.xs },
        sm: { fontSize: theme.fontSize.sm },
        md: { fontSize: theme.fontSize.md },
        lg: { fontSize: theme.fontSize.lg },
        xl: { fontSize: theme.fontSize.xl },
        default: { fontSize: theme.fontSize.md }
      },
      fw: {
        regular: { fontWeight: '400' },
        medium: { fontWeight: '500' },
        semiBold: { fontWeight: '600' },
        bold: { fontWeight: '700' },
        default: { fontWeight: '400' }
      }
    }
  }
}))
