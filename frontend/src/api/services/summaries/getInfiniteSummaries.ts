import { supabase } from "@/supabase/client";
import getUserIdAsync from "../auth/getUserIdAsync";
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
    .select("*, quizzes(id)")
    .filter("owner", "eq", userId)
    .order("created_at", { ascending: false })
    .range(from_, to_)

  if (error) {
    throw error
  }

  const hasNextPage = data.length > pageLimit;

  const summaries = hasNextPage ? data.slice(0, pageLimit) : data

  return {
    results: summaries.map(summary => ({
      ...summary,
      quizId: summary.quizzes?.id ?? null
    })),
    next: hasNextPage ? page + 1 : undefined,
  }
}
