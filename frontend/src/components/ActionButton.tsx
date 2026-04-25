import { MutationStatus } from "@tanstack/react-query";
import ThemedButton, { ThemedButtonProps } from "./ThemedButton";
import { ActivityIndicator, StyleProp, TextProps, TextStyle, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ThemedText from "./ThemedText";
import Animated, { FadeInDown, FadeInUp, SlideInDown, SlideInUp } from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";

export type ActionButtonProps = ThemedButtonProps & {
  status: MutationStatus;
  pendingText?: string;
  successText?: string;
}

export default function ActionButton({
  status,
  title,
  pendingText,
  successText,
  textStyle,
  ...props
}: ActionButtonProps) {

  return (
    <ThemedButton title={title} {...props}>
      {status === "pending"
        ? <PendingLabel
          pendingText={pendingText}
          style={textStyle}
        />
        : status === "success"
          ? <SuccessLabel
            successText={successText}
            style={textStyle}
          />
          : <IdleLabel
            title={title}
            style={textStyle}
          />
      }
    </ThemedButton>
  )
}

type ButtonTextProps<T> = T & {
  style?: StyleProp<TextProps>
}

const PendingLabel = ({
  pendingText,
  style
}: ButtonTextProps<{ pendingText?: string }>
) => {

  const { buttonText } = useUnistyles().theme.colors

  return (
    <Animated.View
      style={styles.labelContainer}
      entering={FadeInDown.springify(500)}
    >
      <ActivityIndicator color={buttonText} />
      <ThemedText color={"buttonText"} style={style}>
        {pendingText ?? "pending..."}
      </ThemedText>
    </Animated.View>
  )
}

const IdleLabel = ({
  title,
  style
}: ButtonTextProps<{ title: string }>
) => {

  return (
    <Animated.View
      entering={FadeInDown.springify(500)}
      style={styles.labelContainer}
    >
      <ThemedText color={"buttonText"} style={style}>
        {title}
      </ThemedText>
    </Animated.View>
  )
}

const SuccessLabel = ({
  successText,
  style
}: ButtonTextProps<{ successText?: string }>
) => {

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
      <ThemedText color={"buttonText"} style={style}>
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
