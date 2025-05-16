import { useThemeContext } from "@/context/Theme"
import { Stack } from "expo-router"

export default function QuizLayout() {

  const { theme } = useThemeContext()

  return (
    <Stack screenOptions={{
      headerTitle: 'quiz',
      headerTintColor: theme.textPrimary,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: theme.background
      }
    }}
    />
  )
}
