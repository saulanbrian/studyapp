import { useThemeContext } from "@/context/Theme";
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function SummaryLayout() {

  const { theme } = useThemeContext()

  return (
    <Stack screenOptions={{
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: theme.surface,
      },
      headerTintColor: theme.textPrimary,
      animation: 'slide_from_right',
      animationDuration: 100
    }}>
      <Stack.Screen name='[id]' options={{
        headerTitle: ''
      }} />
      <Stack.Screen name='create' />
      <Stack.Screen name='favorites' />
    </Stack>
  )
}
