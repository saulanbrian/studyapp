import { useThemeContext } from "@/context/Theme"
import { MutationStatus } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"
import ThemedText from "./ThemedText";
import { Feather, MaterialIcons } from "@expo/vector-icons";

type SubmitButtonProps = TouchableOpacityProps & {
  label: string;
  status: MutationStatus
}

export default function SubmitButton({
  style,
  label,
  disabled,
  status,
  ...props
}: SubmitButtonProps) {

  const { theme } = useThemeContext()

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: theme.iconAccent,
          opacity: disabled && status === 'idle' ? 0.5 : undefined
        },
        styles.container,
        style
      ]}
      disabled={disabled}
      {...props}
    >
      {status === 'success' ? (
        <Feather
          name='check'
          size={20}
          color={theme.iconPrimary}
        />
      ) : status === 'pending' ? (
        <ActivityIndicator color={theme.iconPrimary} />
      ) : (
        <ThemedText style={styles.buttonText}>
          {label}
        </ThemedText>
      )}

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  container: {
    borderRadius: 16,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
