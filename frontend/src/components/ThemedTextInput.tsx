import { forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type ThemedTextInputProps = TextInputProps & {
  error?: boolean
}

const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(({
  error,
  style,
  ...props
}, ref) => {

  const { colors } = useUnistyles().theme
  styles.useVariants({ error })

  return <TextInput
    style={[styles.input, style]}
    placeholderTextColor={colors.textDisabled}
    cursorColor={colors.primary}
    {...props}
  />
})

const styles = StyleSheet.create(theme => ({
  input: {
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderWidth: 1,
    variants: {
      error: {
        true: {
          borderColor: theme.colors.error
        },
        default: {
          borderColor: theme.colors.border
        }
      }
    }
  }
}))

export default ThemedTextInput
