import { ActivityIndicator, StyleSheet, TouchableOpacity, useColorScheme, ViewProps } from "react-native"
import { Loader, ThemedText, ThemedView } from "../ui"
import LottieView from "lottie-react-native"
import { useThemeContext } from "@/context/Theme"

type SuspendedViewWithErrorBoundaryProps = ViewProps & {
  status: 'pending' | 'success' | 'error',
  retryCallback: () => void;
}

export default function SuspendedViewWithErrorBoundary({
  status,
  retryCallback,
  ...props
}: SuspendedViewWithErrorBoundaryProps) {

  return (
    status === 'pending'
      ? <PendingView />
      : status === 'error'
        ? <ErrorView retryCallback={retryCallback} />
        : <ThemedView {...props} />
  )
}

const PendingView = () => {
  return (
    <ThemedView style={styles.container}>
      <Loader showText />
    </ThemedView>
  )
}

const ErrorView = ({ retryCallback }: { retryCallback: () => void }) => {

  const { theme } = useThemeContext()

  return (
    <ThemedView style={styles.container}>
      <LottieView
        source={require('@/assets/animation/error.json')}
        style={styles.errorLottie}
        autoPlay
        loop
      />
      <TouchableOpacity 
        style={[
          { borderColor: theme.textPrimary },
          styles.retryButton
        ]}
        onPress={retryCallback}
      >
        <ThemedText>try again</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 200
  },
  errorLottie: {
    paddingLeft: 12,
    height: 180,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center'
  },
  retryButton: {
    borderRadius: 36,
    borderWidth: 1,
    padding: 12,
    marginRight: 12
  }
})
