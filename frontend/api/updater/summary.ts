import { Summary, UpdatableDataFields } from "@/types/data"
import { InfiniteQueryPage, prependDataToInfiniteQuery, removeItemFromInfiniteQueryById, updateInifiniteQueryResultById } from "@/utils/query"
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

    queryClient.setQueryData<Summary>(['summary', id], prevData => {
      if (prevData) {
        return {
          ...prevData,
          ...updateField
        } as Summary
      }
    })

  }

  const addOrRemoveFromFavorites = (summary: Summary, method: 'add' | 'remove') => {
    queryClient.setQueryData<InfiniteData<InfiniteQueryPage<Summary>>>(
      ['summary', 'favorites'],
      prevData => {
        if (prevData) {

          if (method === 'add') {
            const updatedData = prependDataToInfiniteQuery(prevData, summary)
            return updatedData
          } else {
            const updatedData = removeItemFromInfiniteQueryById({
              data: prevData,
              id: summary.id
            })
            return updatedData
          }

        }
      }
    )
  }


  return { updateSummary, addOrRemoveFromFavorites }
}
