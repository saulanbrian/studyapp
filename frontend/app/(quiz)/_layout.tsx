import { useThemeContext } from "@/context/Theme"
import { Stack } from "expo-router"

export default function QuizLayout() {

  const { theme } = useThemeContext()

  return (
    <Stack screenOptions={{
      headerTintColor: theme.textPrimary,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: theme.surface
      },
    }}
    >
      <Stack.Screen name='[id]' options={{
        headerTitle: 'quiz',
        headerBackVisible: false
      }} />
      <Stack.Screen name='my-quizzes' options={{ headerTitle: 'quizzes' }} />
    </Stack>
  )
}
