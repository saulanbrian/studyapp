import { TransparentModalViewRef } from "@/src/components/TransparentModalView";
import React, { createContext, useCallback, useContext, useRef, useState } from "react";

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>

type PageState = {
  title: string;
  description: string;
  document: { file: ArrayBuffer; title: string } | null;
  cover: { file: ArrayBuffer; fileName: string } | null;
  mutating: boolean;
  sampleModalRef: React.RefObject<TransparentModalViewRef | null>;
  errorMessage?: string
}

type SummaryCreationContextType = PageState & {
  setTitle: StateSetter<PageState["title"]>;
  setDescription: StateSetter<PageState["description"]>;
  setDocument: StateSetter<PageState["document"]>;
  setCover: StateSetter<PageState["cover"]>
  setMutating: StateSetter<PageState["mutating"]>;
  setErrorMessage: StateSetter<PageState["errorMessage"]>;
}

const SummaryCreationContext = createContext<
  SummaryCreationContextType | undefined
>(undefined)

export const useSummaryCreation = () => {
  const context = useContext(SummaryCreationContext)
  if (!context) throw new Error(`
    cannot ise summarycreationcontext outside summarycreationcontextprovider
  `)
  return context
}

export default function SummaryCreationContextProvider({
  children
}: { children?: React.ReactNode }) {

  const [title, setTitle] = useState<PageState["title"]>('')
  const [description, setDescription] = useState<PageState["description"]>('')
  const [cover, setCover] = useState<PageState["cover"]>(null)
  const [document, setDocument] = useState<PageState["document"]>(null)
  const [mutating, setMutating] = useState<PageState["mutating"]>(false)
  const modalRef = useRef<TransparentModalViewRef>(null)
  const [errorMessage, setErrorMessage] = useState<string>()

  return (
    <SummaryCreationContext.Provider value={{
      title,
      cover,
      description,
      mutating,
      document,
      errorMessage,
      setErrorMessage,
      setTitle,
      setDescription,
      setCover,
      setMutating,
      setDocument,
      sampleModalRef: modalRef
    }}>
      {children}
    </SummaryCreationContext.Provider>
  )
}
