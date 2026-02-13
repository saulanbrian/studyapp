import { supabase } from "@/supabase/client";
import getUserIdAsync from "../auth/getUserIdAsync";

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

  return { data, error, uri: path }
}
