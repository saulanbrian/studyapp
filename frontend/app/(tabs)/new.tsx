import { ThemedButton, ThemedView } from "@/components/ui"
import { useAuth } from "@clerk/clerk-expo"

export default function New() {
  const { signOut } = useAuth()

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedButton
        title='logout'
        onPress={() => signOut()}
        color='primary'
      />
    </ThemedView>
  )
}
