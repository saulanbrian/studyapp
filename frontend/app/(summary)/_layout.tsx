import { useThemeContext } from "@/context/Theme";
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function SummaryLayout() {

  const { theme } = useThemeContext()

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.textPrimary,
      }} />
    </SafeAreaProvider>
  )
}
