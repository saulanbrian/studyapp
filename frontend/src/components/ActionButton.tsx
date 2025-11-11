import { MutationStatus } from "@tanstack/react-query";
import ThemedButton, { ThemedButtonProps } from "./ThemedButton";
import { ActivityIndicator, StyleProp, TextStyle, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ThemedText from "./ThemedText";
import Animated, { SlideInDown, SlideInUp } from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";

type ActionButtonProps = ThemedButtonProps & {
  status: MutationStatus;
  pendingText?: string;
  successText?: string;
}

type LabelProps = {
  textStyle: StyleProp<TextStyle>
}

export default function ActionButton({
  status,
  title,
  pendingText,
  textStyle,
  successText,
  ...props
}: ActionButtonProps) {

  return (
    <ThemedButton title={title} {...props}>
      {status === "pending"
        ? <PendingLabel pendingText={pendingText} textStyle={textStyle} />
        : status === "success"
          ? <SuccessLabel textStyle={textStyle} successText={successText} />
          : <IdleLabel title={title} textStyle={textStyle} />
      }
    </ThemedButton>
  )
}


const PendingLabel = ({
  pendingText,
  textStyle
}: LabelProps & { pendingText?: string }) => {

  const { buttonText } = useUnistyles().theme.colors

  return (
    <Animated.View style={styles.labelContainer} entering={SlideInDown.springify(500)}>
      <ActivityIndicator color={buttonText} />
      <ThemedText
        color={"buttonText"}
        style={textStyle}>
        {pendingText ?? "pending..."}
      </ThemedText>
    </Animated.View>
  )
}

const IdleLabel = ({
  title,
  textStyle
}: LabelProps & { title: string }) => {

  return (
    <Animated.View entering={SlideInDown.springify(500)}>
      <ThemedText style={textStyle} color={"buttonText"}>
        {title}
      </ThemedText>
    </Animated.View>
  )
}

const SuccessLabel = ({
  textStyle,
  successText
}: LabelProps & { successText?: string }) => {

  const { buttonText } = useUnistyles().theme.colors

  return (
    <Animated.View style={styles.labelContainer} entering={SlideInUp.springify(500)}>
      <FontAwesome
        name={"check"}
        color={buttonText}
        size={16}
      />
      <ThemedText style={textStyle} color={"buttonText"}>
        {successText ?? "success"}
      </ThemedText>
    </Animated.View>
  )
}

const styles = StyleSheet.create(theme => ({
  labelContainer: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: 'center',
  }
}))
