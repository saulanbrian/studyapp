import { View, ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";


type ThemedViewProps = ViewProps & {
  surface?: boolean
}

export default function ThemedView({
  style,
  surface,
  ...props
}: ThemedViewProps) {

  styles.useVariants({ bg: surface ? "surface" : undefined })

  return <View style={[styles.container, style]} {...props} />
}

const styles = StyleSheet.create(theme => ({
  container: {
    variants: {
      bg: {
        surface: {
          backgroundColor: theme.colors.surface,
        },
        default: {
          backgroundColor: theme.colors.background
        }
      }
    }
  }
}))
