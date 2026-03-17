import { MutationStatus } from "@tanstack/react-query";
import ThemedButton, { ThemedButtonProps } from "./ThemedButton";
import { ActivityIndicator, StyleProp, TextStyle, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ThemedText from "./ThemedText";
import Animated, { FadeInDown, FadeInUp, SlideInDown, SlideInUp } from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";

type ActionButtonProps = ThemedButtonProps & {
  status: MutationStatus;
  pendingText?: string;
  successText?: string;
}


export default function ActionButton({
  status,
  title,
  pendingText,
  successText,
  ...props
}: ActionButtonProps) {

  return (
    <ThemedButton title={title} {...props}>
      {status === "pending"
        ? <PendingLabel pendingText={pendingText} />
        : status === "success"
          ? <SuccessLabel successText={successText} />
          : <IdleLabel title={title} />
      }
    </ThemedButton>
  )
}


const PendingLabel = ({
  pendingText,
}: {
  pendingText?: string
}) => {

  const { buttonText } = useUnistyles().theme.colors

  return (
    <Animated.View
      style={styles.labelContainer}
      entering={FadeInDown.springify(500)}
    >
      <ActivityIndicator color={buttonText} />
      <ThemedText
        color={"buttonText"}
      >
        {pendingText ?? "pending..."}
      </ThemedText>
    </Animated.View>
  )
}

const IdleLabel = ({
  title,
}: {
  title: string
}) => {

  return (
    <Animated.View
      entering={FadeInDown.springify(500)}
      style={styles.labelContainer}
    >
      <ThemedText color={"buttonText"}>
        {title}
      </ThemedText>
    </Animated.View>
  )
}

const SuccessLabel = ({
  successText
}: {
  successText?: string
}) => {

  const { buttonText } = useUnistyles().theme.colors

  return (
    <Animated.View
      style={styles.labelContainer}
      entering={FadeInUp.springify(500)}
    >
      <FontAwesome
        name={"check"}
        color={buttonText}
        size={16}
      />
      <ThemedText color={"buttonText"}>
        {successText ?? "success"}
      </ThemedText>
    </Animated.View>
  )
}


export const AnimatedActionButton = Animated.createAnimatedComponent(ActionButton)

const styles = StyleSheet.create(theme => ({
  labelContainer: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: 'center',
  }
}))
