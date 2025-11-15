import React, { createContext, PropsWithChildren, useCallback, useContext, useState } from "react"
import * as DocumentPicker from "expo-document-picker"
import * as FileSystem from "expo-file-system"
import { decode } from "base64-arraybuffer"


const MAX_FILE_SIZE = 5 * 1024 * 1024

const possibleAssetError = {
  exceedingSize: "the file you're trying to upload exceeds the maximum limit of 5mb",
  formatError: "the file you're trying to upload is not a valid pdf"
}

const fileWithinLimit = async (file: DocumentPicker.DocumentPickerAsset) => {
  let size = file.size
  if (!size) {
    const fileInfo = await FileSystem.getInfoAsync(file.uri)
    if (fileInfo.exists) {
      size = fileInfo.size
    }
  }
  return size ? size <= MAX_FILE_SIZE : false
}

const isPDF = (fileName: string) => {
  const nameSplit = fileName.split('.')
  return nameSplit[nameSplit.length - 1] === "pdf"
}


type SummaryCreationPageContextType = {
  title?: string;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  pdf?: ArrayBuffer;
  description: string | null;
  pdfFileName?: string;
  pickPdf: () => void;
  assetError?: string;
  removePdf: () => void;
  clearError: () => void;
}

const SummaryCreationPageContext = createContext<SummaryCreationPageContextType | null>(null)

export const useSummaryCreationPageContext = () => {
  const context = useContext(SummaryCreationPageContext)
  if (!context) throw new Error(`
    cannot use SummaryCreationPageContext outside SummaryCreationPageContextProvider
  `)
  return context
}

const SummaryCreationPageContextProvider = ({ children }: PropsWithChildren) => {

  const [title, setTitle] = useState<string>()
  const [pdf, setPdf] = useState<ArrayBuffer>()
  const [pdfFileName, setPdfFileName] = useState<string>()
  const [assetError, setAssetError] = useState<string>()
  const [description, setDescription] = useState<string | null>(null)

  const pickPdf = useCallback(async () => {

    const { assets, canceled } = await DocumentPicker.getDocumentAsync({
      base64: false,
      multiple: false
    })

    if (canceled) return

    const chosenDocument = assets[0]
    if (!await fileWithinLimit(chosenDocument)) {
      setAssetError(possibleAssetError.exceedingSize)
      return
    }

    if (!isPDF(chosenDocument.name)) {
      setAssetError(possibleAssetError.formatError)
      return
    }

    const b64 = await FileSystem.readAsStringAsync(
      chosenDocument.uri,
      { encoding: FileSystem.EncodingType.UTF8 }
    )
    const arrayBuffer = decode(b64)
    setPdf(arrayBuffer)
    setPdfFileName(chosenDocument.name)

  }, [])

  const removePdf = useCallback(() => {
    setPdf(undefined)
  }, [])

  const clearError = useCallback(() => {
    setAssetError(undefined)
  }, [])

  return (
    <SummaryCreationPageContext.Provider value={{
      pickPdf,
      setTitle,
      pdf,
      title,
      assetError,
      clearError,
      removePdf,
      pdfFileName,
      description
    }}>
      {children}
    </SummaryCreationPageContext.Provider>
  )
}

export default SummaryCreationPageContextProvider
