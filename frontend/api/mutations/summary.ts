import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import createAxiosInstance from '../'
import { useAuth } from '@clerk/clerk-expo'
import { DocumentPickerAsset } from 'expo-document-picker'
import { InfiniteQueryPage, prependDataToInfiniteQuery } from '@/utils/query'
import { Summary } from '@/types/data'
import { ImagePickerAsset } from 'expo-image-picker'

export const useUploadFileToSummarize = () => {

  const { getToken } = useAuth()
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

      const token = await getToken()
      const api = createAxiosInstance(token!)

      const data = new FormData()

      data.append('file', {
        type: file.mimeType || 'application/pdf',
        uri: file.uri,
        name: file.name
      } as any)

      if (title) {
        data.append('title', title)
      }

      if (image) {
        data.append('cover_image', {
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
    },
    onError: (e) => {
      console.log(e)
    },
    onSuccess: (summary: Summary) => {
      console.log(summary)
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
