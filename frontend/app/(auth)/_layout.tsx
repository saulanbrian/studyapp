import { ThemedView } from '@/components/ui'
import { useThemeContext } from '@/context/Theme'
import { useAuth } from '@clerk/clerk-expo'
import { Stack } from 'expo-router'
import { ActivityIndicator, StyleSheet } from 'react-native'

export default function AuthLayout() {

  const { isSignedIn } = useAuth()
  const { theme } = useThemeContext()

  if (isSignedIn === undefined) return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size={40} />
    </ThemedView>
  )

  return (
    <Stack
      initialRouteName='sso'
      screenOptions={{
        headerTintColor: theme.textPrimary,
        headerStyle: { backgroundColor: theme.surface },
        contentStyle: { backgroundColor: theme.background }
      }}
    >
      <Stack.Screen name='sso' />
      <Stack.Screen name='signin' />
      <Stack.Screen name='signup' />
    </Stack>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
