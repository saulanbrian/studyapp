import { useThemeContext } from "@/context/Theme";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { forwardRef } from "react";

const ThemedInput = forwardRef<TextInput, TextInputProps>(
  ({ style, ...props }, ref) => {

    const { theme } = useThemeContext()

    return (
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            color: theme.textPrimary
          },
          style
        ]}
        ref={ref}
        textAlignVertical="center"
        placeholderTextColor={theme.textSecondary}
        cursorColor={theme.textPrimary}
        {...props} />
    )
  })

const styles = StyleSheet.create({
  input: {
    padding: 8,
    borderRadius: 4,
  }
})

export default ThemedInput
