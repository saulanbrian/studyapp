import { ActivityIndicator, StyleSheet, ViewProps } from "react-native"
import { ThemedText, ThemedView } from "../ui"

type SuspendedViewWithErrorBoundaryProps = ViewProps & {
  status: 'pending' | 'success' | 'error'
}

export default function SuspendedViewWithErrorBoundary({
  status,
  ...props
}: SuspendedViewWithErrorBoundaryProps) {

  return status === 'pending' ? <PendingView />
    : status === 'error' ? <ErrorView />
      : <ThemedView {...props} />

}

const PendingView = () => {
  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator />
    </ThemedView>
  )
}

const ErrorView = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>an error has occured</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
