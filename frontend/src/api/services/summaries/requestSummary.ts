import createAxiosInstance from "@/src/api";
import { supabase } from "@/supabase/client";
import { AxiosError } from "axios";

export default async function requestSummary(id: string) {
  const api = createAxiosInstance({})
  try {
    const res = await api.get(`summary/hello/${id}`)
    if (res.status !== 202) {
      throw new AxiosError("summary request failed")
    }
  } catch (e) {
    console.log("summary request failed", e)
    await supabase.from("summaries")
      .update({ status: "error" })
      .eq("id", id)
  }
}
