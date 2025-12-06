import { InfiniteData, useQueryClient } from "@tanstack/react-query"
import { PageResult } from "../types/PageResult";
import addDataToTopOfInfiniteQueryData from "../utils/addDataToTopOfInfiniteQueryData";
import updateInfiniteQueryDataById from "../utils/updateInfiteQueryDataById";


type QueryUpdaterCommonProps<T> = {
  id: string;
  newData: T;
  queryKey: string[]
}


const useQueryUpdater = <T extends { id: string }>() => {

  const queryClient = useQueryClient()

  function insertIntoInfiniteQuery({
    newData,
    queryKey
  }: Pick<QueryUpdaterCommonProps<T>, "newData" | "queryKey">) {

    queryClient.setQueryData<InfiniteData<PageResult<T>>>(
      queryKey,
      data => {
        if (!data) return

        const updatedData = addDataToTopOfInfiniteQueryData({
          data,
          dataToAdd: newData
        })
        return updatedData
      }
    )
  }

  function updateDataFromInfiniteQuery({
    id,
    newData,
    queryKey
  }: QueryUpdaterCommonProps<T>) {

    queryClient.setQueryData<InfiniteData<PageResult<T>>>(
      queryKey,
      data => {
        if (!data) return

        const updatedData = updateInfiniteQueryDataById({
          data,
          newData,
          id
        })
        return updatedData
      }
    )
  }

  return { updateDataFromInfiniteQuery, insertIntoInfiniteQuery }
}

export default useQueryUpdater

