import { useThemeContext } from "@/context/Theme";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

export default function ThemedInput({ style, ...props }: TextInputProps) {

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
      textAlignVertical="center"
      placeholderTextColor={theme.textSecondary}
      cursorColor={theme.textPrimary}
      {...props} />
  )
}

const styles = StyleSheet.create({
  input: {
    padding: 8,
    borderRadius: 4,
  }
})
