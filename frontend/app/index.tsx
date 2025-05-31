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

  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size={40} />
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
