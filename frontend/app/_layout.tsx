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
import { Button, StatusBar, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import ErrorBoundary, { ErrorBoundaryProps } from 'react-native-error-boundary'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

const queryClient = new QueryClient()

export default function RootLayout() {

  useWarmUpBrowser()

  return (
    <ErrorBoundary
      FallbackComponent={({ resetError, error }) => (
        <ErrorBoundaryPage
          error={error}
          resetError={resetError}
        />
      )}
    >
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
    </ErrorBoundary>
  )
}


const InitialLayout = () => {

  const { } = useThemeContext()

  return (
    <ThemedView style={{ flex: 1 }}>
      <StatusBar
        translucent
        networkActivityIndicatorVisible
      />
      <Stack
        screenOptions={{
          headerShadowVisible: true,
          headerShown: false,
          navigationBarHidden: true
        }}
      />
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
    <View>
      <Text>an error has occured</Text>
      <Text>{error.message}</Text>
      <Button title={'retry'} onPress={resetError} />
    </View>
  )

}
