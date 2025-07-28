import { View, ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function ThemedScreen({
  style,
  ...props
}: ViewProps) {

  return <View style={[styles.container, style]} {...props} />

}


const styles = StyleSheet.create(theme => ({
  container: {
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background
  }
}))
