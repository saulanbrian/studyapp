import { Pressable, PressableProps, View } from "react-native";
import ThemedText from "../ThemedText";
import { StyleSheet } from "react-native-unistyles";
import { darkColors } from "@/src/constants/ui/Colors";

type OptionButtonProps = {
  optionText: string;
  isCorrect: boolean;
} & Pick<PressableProps, 'onPress'>

export default function OptionButton({
  isCorrect,
  onPress,
  optionText,
}: OptionButtonProps) {


  return (
    <Pressable style={styles.button} onPress={onPress}>
      <ThemedText style={styles.buttonText}>
        {optionText}
      </ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create(theme => ({
  button: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.spacing.sm,
    borderColor: darkColors.textPrimary,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md
  },
  buttonText: {
    color: darkColors.textPrimary
  }
}))
