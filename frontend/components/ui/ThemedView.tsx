import { useThemeContext } from "@/context/Theme";
import { forwardRef } from "react";
import { View, ViewProps } from "react-native";
import Animated from "react-native-reanimated";


const ThemedView = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {

    const { theme: { background } } = useThemeContext()

    return (
      <View
        style={[
          { backgroundColor: background },
          style]
        }
        ref={ref}
        {...props} />
    )
  })


export default ThemedView

export const AnimatedThemedView = Animated.createAnimatedComponent(ThemedView)
