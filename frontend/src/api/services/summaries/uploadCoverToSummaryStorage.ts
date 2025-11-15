import { supabase } from "@/src/lib/supabase"
import getUserIdAsync from "../../auth/getUserIdAsync";

export type UploadCoverToSummaryStorageProps = {
  cover: ArrayBuffer;
  coverName: string;
  summaryTitle: string;
}

export default async function uploadCoverToSummaryStorage({
  cover,
  coverName,
  summaryTitle
}: UploadCoverToSummaryStorageProps) {

  const userId = await getUserIdAsync({ throwOnError: true })
  const formattedSummaryTitle = summaryTitle.split(' ').join('-').toLowerCase()
  const path = `${userId}/${formattedSummaryTitle}/cover/${coverName}`

  const { data, error } = await supabase.storage
    .from('summary_bucket')
    .upload(path, cover, {
      contentType: 'image/jpeg'
    })

  let publicUrl = null

  if (data) {
    const { data: uploadedCover } = supabase.storage
      .from('summary_bucket')
      .getPublicUrl(data.path)
    publicUrl = uploadedCover.publicUrl
  }

  return { data, error, uri: publicUrl }
}
