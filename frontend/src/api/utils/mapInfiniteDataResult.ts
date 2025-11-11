import { InfiniteData } from "@tanstack/react-query";
import { PageResult } from "../types/PageResult";

export function mapInfiniteDataResult<T>(data: InfiniteData<PageResult<T>>): T[] {

  const sum: T[] = []

  data.pages.forEach(page => {
    page.results.forEach(res => {
      sum.push(res)
    })
  })

  return sum
}
