import { supabase } from "@/supabase/client";
import { Summary } from "../../types/summary";

export default async function updateSummary({
  id,
  fields
}: {
  id: string;
  fields: Partial<Summary>
}) {
  return await supabase
    .from("summaries")
    .update(fields)
    .eq("id", id)
    .select()
    .single()
}
