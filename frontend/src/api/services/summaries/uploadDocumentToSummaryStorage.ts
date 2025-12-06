import { supabase } from "@/supabase/client";
import getUserIdAsync from "../auth/getUserIdAsync";

export default async function uploadDocumentToSummaryStorage({
  document,
  documentTitle,
  summaryTitle
}: {
  summaryTitle: string;
  document: ArrayBuffer;
  documentTitle: string
}) {

  const userId = await getUserIdAsync({ throwOnError: true })
  const fomattedSummaryTitle = summaryTitle.split(' ').join('-').toLowerCase()
  const path = `${userId}/${fomattedSummaryTitle}/document/${documentTitle}`

  const { data, error } = await supabase.storage
    .from("summary_bucket")
    .upload(path, document, {
      contentType: 'application/pdf'
    })

  let publicUrl = null;

  if (data) {
    const { data: uploadedDocument } = supabase.storage
      .from('summary_bucket')
      .getPublicUrl(data.path)
    publicUrl = uploadedDocument.publicUrl
  }

  return { data, error, uri: publicUrl }

}

