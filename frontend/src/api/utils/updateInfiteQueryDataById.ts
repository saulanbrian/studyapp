import { InfiniteData } from "@tanstack/react-query"
import { PageResult } from "../types/PageResult"

type Props<T> = {
  data: InfiniteData<PageResult<T>>;
  updateFields: Partial<T>;
  id: string
}

export default function updateInfiniteQueryDataById<T extends { id: string }>({
  data,
  id,
  updateFields
}: Props<T>): InfiniteData<PageResult<T>> {

  return {
    ...data,
    pages: [
      ...data.pages.map((page, i) => {
        return {
          ...page,
          results: [
            ...page.results.map(res => {
              if (res.id === id) return {
                ...res,
                ...updateFields
              }
              return res
            })
          ]
        }
      })
    ]
  }

}
