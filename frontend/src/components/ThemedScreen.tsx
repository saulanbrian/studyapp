import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { View, ViewProps } from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import { StyleSheet } from "react-native-unistyles";

export default function ThemedScreen({
  style,
  ...props
}: ViewProps) {

  const { reset } = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary onError={reset}>
      <View style={[styles.container, style]} {...props} />
    </ErrorBoundary>
  )
}


const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background
  }
}))
