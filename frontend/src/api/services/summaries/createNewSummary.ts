import { supabase } from "@/src/lib/supabase";
import { Summary } from "../../types/summary";
import getUserIdAsync from "../../auth/getUserIdAsync";
import uploadDocumentToSummaryStorage from "./uploadDocumentToSummaryStorage";
import uploadCoverToSummaryStorage from "./uploadCoverToSummaryStorage";

export type CreateNewSummaryProps = Pick<Summary, 'description' | 'title'> & {
  document: ArrayBuffer;
  documentName: string;
  cover?: ArrayBuffer;
  coverName?: string
}

export default async function createNewSummary({
  description,
  title,
  document,
  documentName,
  cover,
  coverName
}: CreateNewSummaryProps) {

  const userId = await getUserIdAsync({ throwOnError: true })

  const {
    data: documentUploaded,
    error: documentUploadError,
    uri: documentUrl
  } = await uploadDocumentToSummaryStorage({
    document,
    documentTitle: documentName,
    summaryTitle: title
  })
  if (documentUploadError || !documentUploaded) {
    throw documentUploadError || new Error("An error has occured upon uploading document")
  }

  let coverUrl = null

  if (cover && coverName) {
    const {
      data: coverUploaded,
      error: coverUploadError,
      uri
    } = await uploadCoverToSummaryStorage({
      cover,
      coverName,
      summaryTitle: title
    })
    coverUrl = uri
  }
  //can ignore  error because cover_url is an optional field
  //and it will be editable in case upload doesnt work

  const { data: summary, error: summaryError } = await supabase
    .from("summaries")
    .insert({
      owner: userId!,
      title,
      description,
      document_url: documentUploaded.fullPath,
      cover_url: coverUrl
    })
    .select()
    .single()

  if (summaryError || !summary) {
    throw summaryError || new Error("an error has occured")
  }

  return summary

}
