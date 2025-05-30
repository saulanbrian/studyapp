import { ActivityIndicator, StyleSheet, TouchableOpacity, useColorScheme, ViewProps } from "react-native"
import { Loader, ThemedText, ThemedView, ErrorView, LoadingView } from "../ui"
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
      ? <LoadingView />
      : status === 'error'
        ? <ErrorView retryCallback={retryCallback} />
        : <ThemedView {...props} />
  )
}
