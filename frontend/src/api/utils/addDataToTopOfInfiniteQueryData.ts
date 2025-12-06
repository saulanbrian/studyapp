import { InfiniteData } from "@tanstack/react-query"
import { PageResult } from "../types/PageResult"

type Props<T> = {
  data: InfiniteData<PageResult<T>>;
  dataToAdd: T
}

export default function addDataToTopOfInfiniteQueryData<T>({
  data,
  dataToAdd
}: Props<T>): InfiniteData<PageResult<T>> {

  return {
    ...data,
    pages: [
      ...data.pages.map((page, i) => {
        return {
          ...page,
          results: i === 0 ? [dataToAdd, ...page.results] : page.results
        }
      })
    ]
  }

}
