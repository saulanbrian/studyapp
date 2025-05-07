import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import * as DocumentPicker from 'expo-document-picker'
import { useNavigation, useRouter } from "expo-router";
import { Alert } from "react-native";
import { MutationStatus } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";

type SummaryCreationPageContextType = {
  document: DocumentPicker.DocumentPickerAsset | null;
  setDocument: React.Dispatch<React.SetStateAction<DocumentPicker.DocumentPickerAsset | null>>;
  title: string | null;
  setTitle: React.Dispatch<React.SetStateAction<string | null>>;
  formStatus: MutationStatus,
  setFormStatus: React.Dispatch<React.SetStateAction<MutationStatus>>;
  image: ImagePickerAsset | null,
  setImage: React.Dispatch<React.SetStateAction<ImagePickerAsset | null>>;
}


const SummaryCreationPage = createContext<SummaryCreationPageContextType | null>(null)


export const useSummaryCreationPage = () => {
  const context = useContext(SummaryCreationPage)
  if (!context) throw new Error(
    'can\'t  use summary context outside SummaryCreationPageProvider'
  )
  return context
}

export default function SummaryCreationPageProvider({
  children
}: PropsWithChildren) {

  const [document, setDocument] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const [title, setTitle] = useState<string | null>(null)
  const [formStatus, setFormStatus] = useState<MutationStatus>('idle')
  const [image, setImage] = useState<ImagePickerAsset | null>(null)

  return (
    <SummaryCreationPage.Provider value={{
      document,
      setDocument,
      title,
      setTitle,
      formStatus,
      setFormStatus,
      image,
      setImage
    }}>
      {children}
    </SummaryCreationPage.Provider>
  )
}
