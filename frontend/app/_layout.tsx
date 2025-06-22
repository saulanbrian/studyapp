import { Slot, Stack, useRouter } from 'expo-router'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@/cache'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser'
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from '@tanstack/react-query'
import ThemeContextProvider, { useThemeContext } from '@/context/Theme'
import { ErrorView, ThemedText, ThemedView, ThemedButton, StandardCTAButton } from '@/components/ui'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Button, StatusBar, StyleSheet, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import ErrorBoundary, { ErrorBoundaryProps } from 'react-native-error-boundary'
import { isAxiosError } from 'axios'
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  EvilIcons,
  AntDesign,
  SimpleLineIcons,
  Fontisto,
} from '@expo/vector-icons'
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'

import { ENV } from '@/constants/Env'

const queryClient = new QueryClient()


SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  const { reset } = useQueryErrorResetBoundary()
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        ...Ionicons.font,
        ...MaterialIcons.font,
        ...MaterialCommunityIcons.font,
        ...Feather.font,
        ...SimpleLineIcons.font,
        ...AntDesign.font,
        ...Fontisto.font
      })
      setFontsLoaded(true)
    })()
  }, [])

  useWarmUpBrowser()

  if (!fontsLoaded) return null

  return (
    <ThemeContextProvider>
      <ErrorBoundary
        onError={reset}
        FallbackComponent={({ resetError, error }) => (
          <ErrorBoundaryPage
            error={error}
            resetError={resetError}
          />
        )}
      >
        <ClerkProvider
          publishableKey={ENV.CLERK_PUBLISHABLE_KEY}
          tokenCache={tokenCache}
        >
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView>
              <BottomSheetModalProvider>
                <InitialLayout />
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </ClerkProvider>
      </ErrorBoundary>
    </ThemeContextProvider>
  )
}


const InitialLayout = () => {

  const { isSignedIn } = useAuth()

  const signedIn = useMemo(() => {
    return isSignedIn ? isSignedIn : false
  }, [isSignedIn])

  const handleLayout = useCallback(async () => {
    await SplashScreen.hideAsync()
  }, [])

  return (
    <ThemedView
      onLayout={handleLayout}
      style={{ flex: 1 }}
    >
      <Stack
        screenOptions={{
          headerShadowVisible: true,
          headerShown: false,
          navigationBarHidden: true,
          animation: 'slide_from_right',
          animationDuration: 100
        }}
      >
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name='(tabs)' />
          <Stack.Screen name='(quiz)' />
          <Stack.Screen name='(summary)' />
        </Stack.Protected>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name='(auth)' />
        </Stack.Protected>
      </Stack>
    </ThemedView>
  )
}

const ErrorBoundaryPage = ({
  error,
  resetError
}: {
  error: Error;
  resetError: () => void
}) => {

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={{ fontSize: 40, marginTop: 'auto' }}>
        System Error!
      </ThemedText>
      <ThemedText style={{ fontSize: 12 }}>
        if the app continue crashing, kindly report or restart
      </ThemedText>
      <StandardCTAButton
        label='try again'
        onPress={resetError}
        style={styles.button}
      />
    </ThemedView>
  )

}

const styles = StyleSheet.create({
  button: {
    marginTop: 8
  },
  container: {
    flex: 1,
    padding: 12,
  },

})
