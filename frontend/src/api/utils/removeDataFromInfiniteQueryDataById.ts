import { InfiniteData } from "@tanstack/react-query";
import { PageResult } from "../types/PageResult";

export default function removeDataFromInifiniteQueryDataById<T extends { id: string }>({
  data,
  id
}: {
  data: InfiniteData<PageResult<T>>;
  id: string
}) {

  return {
    ...data,
    pages: data.pages.map(page => ({
      ...page,
      results: page.results.filter(res => res.id !== id)
    }))
  }
}
