import { LoadingView, ThemedView } from "@/components/ui"
import { useAuth } from "@clerk/clerk-expo"
import { Href, useRouter } from "expo-router"
import { useEffect } from "react"
import { ActivityIndicator, StyleSheet } from "react-native"

export default () => {

  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      router.replace({
        pathname: isSignedIn
          ? '/(tabs)'
          : '/(auth)/sign-in'
      })
    }
  }, [isLoaded, isSignedIn])

  return <LoadingView style={{ marginBottom: 0 }} />
}

