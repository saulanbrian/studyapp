import { InfiniteData } from "@tanstack/react-query"
import { PageResult } from "../types/PageResult"

type Props<T> = {
  data: InfiniteData<PageResult<T>>;
  newData: T;
  id: string
}

export default function updateInfiniteQueryDataById<T extends { id: string }>({
  data,
  id,
  newData
}: Props<T>): InfiniteData<PageResult<T>> {

  return {
    ...data,
    pages: [
      ...data.pages.map((page, i) => {
        return {
          ...page,
          results: [
            ...page.results.map(res => {
              if (res.id === id) return newData
              return res
            })
          ]
        }
      })
    ]
  }

}
