import { supabase } from "@/supabase/client"
import { User } from "@supabase/supabase-js"
import { startTransition, useActionState, useEffect } from "react"


export const useUser = () => {
  const [user, getUser, isLoading] = useActionState<User | null>(
    async () => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
    null
  )

  useEffect(() => {
    startTransition(getUser)
  }, [])

  return { user, isLoading }
}
