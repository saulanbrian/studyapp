import { Summary, UpdatableDataFields } from "@/types/data"
import { InfiniteQueryPage, removeItemFromInfiniteQueryById, updateInifiniteQueryResultById } from "@/utils/query"
import { InfiniteData, useQueryClient } from "@tanstack/react-query"


type UpdateParams = {
  id: string;
  updateField: UpdatableDataFields<Summary>
}

export default function useSummaryUpdater() {

  const queryClient = useQueryClient()

  const updateSummary = ({ id, updateField }: UpdateParams) => {

    queryClient.setQueryData<InfiniteData<InfiniteQueryPage<Summary>>>(['summaries'], prevData => {
      if (prevData) {
        const updatedData = updateInifiniteQueryResultById({
          data: prevData,
          id,
          updateField
        })
        return updatedData
      }
    })

    queryClient.setQueryData<InfiniteData<InfiniteQueryPage<Summary>>>(['summary', 'favorites'], prevData => {
      if (prevData && updateField.favorite !== undefined) {
        if (updateField.favorite) {
          const updatedData = updateInifiniteQueryResultById({
            data: prevData,
            id,
            updateField
          })
          return updatedData
        } else {
          const updatedData = removeItemFromInfiniteQueryById({ data: prevData, id })
          return updatedData
        }
      }
    })

    queryClient.setQueryData<Summary>(['summary', id], prevData => {
      if (prevData) {
        return {
          ...prevData,
          ...updateField
        } as Summary
      }
    })

  }


  return { updateSummary }
}
