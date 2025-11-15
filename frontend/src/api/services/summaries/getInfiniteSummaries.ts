import { supabase } from "@/src/lib/supabase";
import getUserIdAsync from "../../auth/getUserIdAsync";
import { PageResult } from "../../types/PageResult";
import { Summary } from "../../types/summary";

const pageLimit = 10

export default async function getInfiniteSummaries({
  page,
}: {
  page: number;
}): Promise<PageResult<Summary>> {
  const userId = await getUserIdAsync({ throwOnError: true })
  if (!userId) throw new Error("No user logged in")

  const from_ = (page - 1) * pageLimit
  const to_ = page * pageLimit

  const { data, error } = await supabase
    .from("summaries")
    .select("*")
    .filter("owner", "eq", userId)
    .order("created_at", { ascending: false })
    .range(from_, to_)

  if (error || !data) {
    throw error || new Error("No data found")
  }

  const hasNextPage = data.length > pageLimit;

  return {
    results: hasNextPage ? data.slice(0, pageLimit) : data,
    next: hasNextPage ? page + 1 : undefined,
  }
}
