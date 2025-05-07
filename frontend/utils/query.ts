import { InfiniteData } from '@tanstack/react-query'

export type InfiniteQueryPage<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[]
}

export function summarizeInfiniteQueryResult<T>(
  data: InfiniteData<InfiniteQueryPage<T>>
): T[] {
  let results = []
  if (data.pages && data.pages.length >= 1) {
    for (let page of data.pages) {
      results.push(...page.results)
    }
  }
  return results
}

export function prependDataToInfiniteQuery<T>(
  query: InfiniteData<InfiniteQueryPage<T>>,
  data: T
): InfiniteData<InfiniteQueryPage<T>> {

  return {
    ...query,
    pages: query.pages.map((page, i) => ({
      ...page,
      results: i === 0 ? [data, ...page.results] : page.results
    }))
  }
}
