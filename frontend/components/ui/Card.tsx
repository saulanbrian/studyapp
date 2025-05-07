import { useThemeContext } from "@/context/Theme";
import { forwardRef } from "react";
import { View, ViewProps } from "react-native";



const Card = forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {

    const { theme: { surface, border } } = useThemeContext()

    return (
      <View style={[
        {
          backgroundColor: surface,
          borderRadius: 8,
          borderColor: border
        },
        style
      ]}
        ref={ref}
        {...props}
      />
    )
  })


export default Card
