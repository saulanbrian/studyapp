import { Summary } from "@/types/data"
import { InfiniteQueryPage, updateInifiniteQueryResultById } from "@/utils/query"
import { InfiniteData, useQueryClient } from "@tanstack/react-query"

export default function useSummaryUpdater() {

  const queryClient = useQueryClient()

  const updateSummary = (id: string, updatedSummary: Summary) => {
    queryClient.setQueryData<InfiniteData<InfiniteQueryPage<Summary>>>(['summaries'], prevData => {
      if (prevData) {
        const updatedData = updateInifiniteQueryResultById({
          data: prevData,
          id,
          updatedResult: updatedSummary
        })
        return updatedData
      }
    })
  }

  return { updateSummary }
}
