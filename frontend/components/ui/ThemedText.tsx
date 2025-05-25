import { useThemeContext } from "@/context/Theme";
import { PropsWithChildren } from "react";
import { Text, TextProps } from "react-native";
import Animated from "react-native-reanimated";

type ThemedTextProps = TextProps & {
  secondary?: boolean;
}

export default function ThemedText({
  children,
  style,
  secondary,
  ...props
}: PropsWithChildren<ThemedTextProps>) {

  const { theme: { textSecondary, textPrimary } } = useThemeContext()

  return (
    <Text style={
      [
        {
          color: secondary ? textSecondary : textPrimary,
          fontWeight: 'bold'
        },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  )
}

export const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText)
