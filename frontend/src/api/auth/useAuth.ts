import { supabase } from "@/src/lib/supabase"
import { useQueryClient } from "@tanstack/react-query"
import * as SecureStore from "expo-secure-store"

export const useAuth = () => {

  const queryClient = useQueryClient()

  const signOut = async () => {
    queryClient.clear()
    await SecureStore.deleteItemAsync("user_id")
    supabase.auth.signOut()
  }

  const saveUserId = async (id: string) => {
    await SecureStore.setItemAsync("user_id", id)
  }

  return { signOut, saveUserId }
}
