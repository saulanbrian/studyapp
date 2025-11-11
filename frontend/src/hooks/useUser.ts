import { startTransition, useActionState, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { AuthError, User } from "@supabase/supabase-js"
import useEffectAfterMount from "./useEffectAfterMount"

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
