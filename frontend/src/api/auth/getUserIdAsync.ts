import * as SecureStore from "expo-secure-store"

export default async function getUserIdAsync() {
  const userId = await SecureStore.getItemAsync("user_id")
  return userId
} 
