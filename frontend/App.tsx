import './unistyles.ts'
import 'react-native-reanimated'
import 'react-native-gesture-handler'
import { ClerkProvider } from "@clerk/clerk-expo"
import { tokenCache } from "./cache"
import { ENV } from "./constants/Env"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import RootNavigator from './src/navigation/RootNavigator'

const queryClient = new QueryClient()

export default function App() {

  return (
    <ClerkProvider
      publishableKey={ENV.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <RootNavigator />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

