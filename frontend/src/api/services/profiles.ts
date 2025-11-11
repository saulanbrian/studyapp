import { supabase } from "@/src/lib/supabase";
import getUserIdAsync from "../auth/getUserIdAsync";

export async function getProfile() {

  const userId = await getUserIdAsync()
  if (!userId) throw new Error("No user logged In")

  const { data, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (profileError) throw profileError

  return data
}
