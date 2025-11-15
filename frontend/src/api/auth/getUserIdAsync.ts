import * as SecureStore from "expo-secure-store"

export default async function getUserIdAsync({
  throwOnError
}: {
  throwOnError: boolean
}) {
  const userId = await SecureStore.getItemAsync("user_id")
  if (throwOnError && !userId) throw new Error("No user logged in!")
  return userId
} 
