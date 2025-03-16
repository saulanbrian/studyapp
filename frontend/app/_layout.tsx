import { Slot, useRouter } from 'expo-router' 
import { ClerkProvider, ClerkLoaded, useAuth} from '@clerk/clerk-expo'
import { tokenCache } from '@/cache'
import { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import {useWarmUpBrowser } from '@/hooks/useWarmUpBrowser'

const InitialLayout = () => {
  
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    router.replace(
      isSignedIn
      ? '/(tabs)/'
      : '/(auth)/sign-in'
    )
  },[isSignedIn])
  
  if(!isLoaded) return null
  
  return <Slot />
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout(){
  
  useWarmUpBrowser()
  
  return (
    <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  )
}