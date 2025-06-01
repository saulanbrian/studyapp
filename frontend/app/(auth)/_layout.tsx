import { LoadingView } from '@/components/ui'
import { useAuth } from '@clerk/clerk-expo'
import { Stack } from 'expo-router'

export default function AuthLayout() {

  const { isSignedIn } = useAuth()

  if (isSignedIn === undefined) return <LoadingView />

  return <Stack />
}
