import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import createAxiosInstance from '../'
import { useAuth } from '@clerk/clerk-expo'
import { DocumentPickerAsset } from 'expo-document-picker'
import { InfiniteQueryPage, prependDataToInfiniteQuery } from '@/utils/query'
import { Summary } from '@/types/data'
import { ImagePickerAsset } from 'expo-image-picker'
import useSummaryUpdater from '../updater/summary'
import { useState } from 'react'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'

export const useUploadFileToSummarize = () => {

  const { getApi } = useAuthenticatedRequest()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      {
        file,
        title,
        image
      }: {
        file: DocumentPickerAsset;
        title: string | null;
        image: ImagePickerAsset | null
      }
    ) => {

      const api = await getApi()
      if (api) {
        const data = new FormData()

        data.append('file', {
          type: file.mimeType || 'application/pdf',
          uri: file.uri,
          name: file.name
        } as any)

        data.append('title', title ? title : file.name)


        if (image) {
          data.append('cover', {
            type: image.mimeType || 'image/jpeg',
            uri: image.uri,
            name: image?.fileName || 'cover_image.jpg'
          } as unknown as Blob)
        }

        const res = await api.post('summary/', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return res.data
      }
    },
    onError: (e) => {
      console.log(e)
    },
    onSuccess: (summary: Summary) => {
      queryClient.setQueryData<InfiniteData<InfiniteQueryPage<Summary>>>(
        ['summaries'],
        data => {
          if (data) {
            const updatedData = prependDataToInfiniteQuery(data, summary)
            return updatedData
          }
        }
      )
    }
  })
}


export const useRetrySummarization = () => {

  const { getApi } = useAuthenticatedRequest()
  const { updateSummary } = useSummaryUpdater()

  return useMutation<Summary, unknown, string>({
    mutationFn: async (id: string) => {
      const api = await getApi()
      if (api) {
        const res = await api.post('summary/retry-summary', { id })
        return res.data
      }

      throw new Error('authentication failed')
    },
    onSuccess: ({ id, ...data }) => {
      updateSummary({
        id,
        updateField: { ...data }
      })
    }
  })
}
