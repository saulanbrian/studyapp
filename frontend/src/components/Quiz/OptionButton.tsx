import { Pressable, PressableProps, PressableStateCallbackType, View, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { darkColors } from "@/src/constants/ui/Colors";
import { useMemo } from "react";
import { Entypo } from "@expo/vector-icons";

type OptionButtonProps = {
  optionText: string;
  style?: ViewStyle,
} & Pick<PressableProps, 'onPress' | 'disabled'>

export default function OptionButton({
  onPress,
  disabled,
  style,
  optionText,
}: OptionButtonProps) {

  const _true = useMemo(() => {
    return optionText.toLowerCase() === "true"
  }, [optionText])

  const _false = useMemo(() => {
    return optionText.toLowerCase() === "false"
  }, [optionText])

  return (
    <Pressable
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}
    >
      {_true ? <CheckIcon />
        : _false ? <CrossIcon />
          : (
            <ThemedText style={styles.buttonText}>
              {optionText}
            </ThemedText>
          )
      }
    </Pressable>
  )
}

const CheckIcon = () => {

  return <Entypo
    name={"check"}
    size={40}
    color={darkColors.textPrimary}
  />
}

const CrossIcon = () => {

  return <Entypo
    name={"cross"}
    size={40}
    color={darkColors.textPrimary}
  />
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
