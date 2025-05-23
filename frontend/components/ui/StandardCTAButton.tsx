import { useThemeContext } from "@/context/Theme"
import ThemedButton, { ThemedButtonProps } from "./ThemedButton"
import { StyleSheet } from "react-native"
import ThemedText from "./ThemedText";

type StandardCTAButtonProps = ThemedButtonProps & {
  label: string;
}

export default function StandardCTAButton({
  outlined,
  style,
  label,
  color: buttonColor,
  ...props
}: StandardCTAButtonProps) {

  const { theme } = useThemeContext()

  return (
    <ThemedButton
      style={[styles.button, style]}
      outlined={outlined}
      color={buttonColor}
      {...props}
    >
      <ThemedText
        style={[
          {
            ...({
              color: outlined
                ? (buttonColor ? theme[buttonColor] : theme.primary)
                : theme.textPrimary
            })
          },
          styles.buttonText
        ]}
        adjustsFontSizeToFit>
        {label}
      </ThemedText>
    </ThemedButton>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 12
  },
  buttonText: {
    fontSize: 16,
  }
})
