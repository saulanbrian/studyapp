import { Slot, Stack, useRouter } from 'expo-router'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@/cache'
import { useEffect } from 'react'
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ThemeContextProvider, { useThemeContext } from '@/context/Theme'
import * as NavigationBar from 'expo-navigation-bar'
import { ThemedView } from '@/components/ui'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

const InitialLayout = () => {

  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const { theme } = useThemeContext()

  useEffect(() => {
    router.replace(
      isSignedIn
        ? '/(tabs)/'
        : '/(auth)/sign-in'
    )
  }, [isSignedIn])

  if (!isLoaded) return null

  return (
    <ThemedView style={{ flex: 1 }}>
      <StatusBar translucent />
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: theme.background,
            flex: 1
          },
          headerShown: false,
          navigationBarHidden: true
        }}
      />
    </ThemedView>
  )
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

const queryClient = new QueryClient()

export default function RootLayout() {

  useWarmUpBrowser()

  return (
    <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeContextProvider>
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView>
              <BottomSheetModalProvider>
                <InitialLayout />
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </ThemeContextProvider>
      </ClerkLoaded>
    </ClerkProvider>
  )
}
