import { useThemeContext } from "@/context/Theme";
import { forwardRef } from "react";
import { View, ViewProps } from "react-native";
import Animated from "react-native-reanimated"


type ThemedViewProps = ViewProps & {
  surface?: boolean
}

const ThemedView = forwardRef<View, ThemedViewProps>(
  ({ style, surface, ...props }, ref) => {

    const { theme: { background, surface: themeSurface } } = useThemeContext()

    return (
      <View
        style={[
          { backgroundColor: surface ? themeSurface : background },
          style]
        }
        ref={ref}
        {...props} />
    )
  })


export default ThemedView

export const AnimatedThemedView = Animated.createAnimatedComponent(ThemedView)
