import { Summary, UpdatableDataFields } from '@/types/data';
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


export function updateInifiniteQueryResultById<T extends { id: string }>({
  data,
  id,
  updateField
}: {
  data: InfiniteData<InfiniteQueryPage<T>>,
  id: string;
  updateField: UpdatableDataFields<T>
}): InfiniteData<InfiniteQueryPage<T>> {

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      results: page.results.map(result => {
        return result.id === id ? {
          ...result,
          ...updateField
        } : result
      })
    }))
  }

}


export function removeItemFromInfiniteQueryById<T extends { id: string }>({
  id,
  data
}: {
  id: string;
  data: InfiniteData<InfiniteQueryPage<T>>
}): InfiniteData<InfiniteQueryPage<T>> {

  return {
    ...data,
    pages: data.pages.map(page => ({
      ...page,
      results: page.results.filter(res => res.id !== id)
    }))
  }

}
