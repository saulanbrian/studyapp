import { AttachmentInputButton, ThemedAlert, ThemedScreen, ThemedText, ThemedTextInput, ThemedView, TransparentModalView } from "@/src/components";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as DocumentPicket from "expo-document-picker"
import * as FileSystem from "expo-file-system"
import { decode } from "base64-arraybuffer";
import getFileSize from "@/src/utils/FileSystem/getFileSize";
import { Alert, Keyboard, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import * as ImagePicker from "expo-image-picker"
import ActionButton, { AnimatedActionButton } from "@/src/components/ActionButton";
import { useMutation } from "@tanstack/react-query";
import createNewSummary from "@/src/api/services/summaries/createNewSummary";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { SummaryStackParamList } from "@/src/navigation/Summary/types";
import { requestSummary } from "@/src/api/services/summaries";
import SamplePdfModal from "./components/SamplePdfModal";
import SummaryCreationContextProvider, { useSummaryCreation } from "./context/SummaryCreationPageContext";
import useQueryUpdater from "@/src/api/hooks/useQueryUpdater";
import { Summary } from "@/src/api/types/summary";
import { supabase } from "@/supabase/client";
import getUserIdAsync from "@/src/api/services/auth/getUserIdAsync";

const MaxDocumentSize = 5 * 1024 * 1024

export default function SummaryCreationPage() {

  return (
    <SummaryCreationContextProvider>
      <ThemedScreen style={styles.screen}>
        <ThemedText size={"lg"} fw={"semiBold"}>
          Create a Summary
        </ThemedText>
        <TitleInput />
        <DescriptionInput />
        <View style={styles.attachmentInputsContainer}>
          <DocumentInput />
          <CoverInput />
        </View>
        <SubmitButton />
        <ThemedText color={"secondary"} >
          Document must be:
        </ThemedText>
        <SamplePdfModalButton />
        <SamplePdfModal />
        <ErrorModal />
      </ThemedScreen>
    </SummaryCreationContextProvider>
  )
}

const TitleInput = () => {

  const { title, setTitle } = useSummaryCreation()
  styles.useVariants({ empty: !title })

  return <ThemedTextInput
    value={title}
    style={[styles.input, styles.requiredInput]}
    onChangeText={setTitle}
    placeholder={"title of the summmary"}
    autoFocus={true}
  />
}

const DocumentInput = () => {

  const { document, setDocument, setErrorMessage } = useSummaryCreation()
  styles.useVariants({ empty: !document, attachment: true })

  const pickDocument = useCallback(async () => {

    const { assets, canceled } = await DocumentPicket.getDocumentAsync({
      base64: false,
      multiple: false,
      type: "application/pdf",
    })

    if (canceled) return;
    if (assets.length < 1) {
      setErrorMessage("Unknown error occured, please try again")
      return
    }

    const chosenDocument = assets[0]
    let size = chosenDocument.size ?? null
    if (size === null) {
      size = await getFileSize({ uri: chosenDocument.uri })
    }
    if (!size || size > MaxDocumentSize) {
      setErrorMessage("File is too large")
      return
    }

    const b64 = await FileSystem.readAsStringAsync(
      chosenDocument.uri,
      { encoding: 'base64' }
    )
    const documentAsArrayBuffer = decode(b64)
    setDocument({
      file: documentAsArrayBuffer,
      title: chosenDocument.name
    })

  }, [document])

  return (
    <AttachmentInputButton
      placeholder={"Attach your pdf"}
      selectedFileName={document?.title ?? undefined}
      onPress={() => { document ? setDocument(null) : pickDocument() }}
      style={[styles.input, styles.requiredInput, styles.attachmentInput]}
    />
  )
}

const DescriptionInput = () => {

  const { description, setDescription } = useSummaryCreation()

  return (
    <ThemedTextInput
      value={description}
      onChangeText={setDescription}
      placeholder={"provide a description for this summary..."}
      multiline={true}
      numberOfLines={3}
      style={[styles.input, styles.descriptionInput]}
    />
  )
}

const CoverInput = () => {

  const { cover, setCover, setErrorMessage } = useSummaryCreation()
  styles.useVariants({ attachment: true })

  const pickImage = useCallback(async () => {
    const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: false,
      aspect: [9, 12]
    })
    if (canceled || assets.length < 1) {
      setErrorMessage("Unknown error occured, please try again")
      return
    }
    const image = assets[0]
    const b64 = await FileSystem.readAsStringAsync(
      image.uri,
      { encoding: 'base64' }
    )
    const coverArrayBuffer = decode(b64)
    setCover({
      file: coverArrayBuffer,
      fileName: image.fileName ?? "cover_image.jpeg"
    })
  }, [cover])

  return (
    <AttachmentInputButton
      placeholder={"Attach cover image"}
      selectedFileName={cover?.fileName ?? undefined}
      onPress={() => {
        cover ? setCover(null) : pickImage()
      }}
      style={[styles.input, styles.attachmentInput]}
    />
  )
}

const SubmitButton = () => {

  const navigation = useNavigation<NavigationProp<SummaryStackParamList>>()
  const {
    title,
    description,
    cover,
    document,
    mutating,
    setMutating,
    setErrorMessage
  } = useSummaryCreation()
  const {
    insertIntoInfiniteQuery,
    updateDataFromInfiniteQuery
  } = useQueryUpdater<Summary>()

  const { status, mutate } = useMutation({
    mutationFn: async () => {
      const data = await createNewSummary({
        cover: cover?.file ?? undefined,
        coverName: cover?.fileName ?? undefined,
        title,
        description:
          description.trim() === ''
            ? null
            : description
        ,
        document: document!.file,
        documentName: document!.title
      })
      insertIntoInfiniteQuery({
        newData: {
          ...data,
          quizId: null
        },
        queryKey: ["summaries"]
      })
      requestForSummary(data.id)
      return data
    },
    onMutate: () => {
      Keyboard.dismiss()
      setMutating(true)
    },
    onSuccess: () => {
      setTimeout(() => {
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate('SummaryList')
      }, 1000)
    },
    onSettled: () => setMutating(false),
    onError: e => setErrorMessage(e.message)
  })

  const handleSubmit = useCallback(() => {
    if (document && title) {
      mutate()
    }
  }, [cover, description, document, title])

  const requestForSummary = useCallback(
    async (id: string) => {
      const data = await requestSummary(id)
      if (!data) {
        updateDataFromInfiniteQuery({
          id,
          queryKey: ["summaries"],
          updateFields: {
            status: "error"
          }
        })
      }
    }, [])

  return (
    <AnimatedActionButton
      status={status}
      title={"submit"}
      onPress={handleSubmit}
      disabled={!document || !title.trim() || mutating}
      textStyle={styles.buttonText}
      style={styles.submitButton}
    />
  )
}

const SamplePdfModalButton = () => {

  const { sampleModalRef } = useSummaryCreation()
  const [isLoading, setIsLoading] = useState(true)
  const [hasSummary, setHasSummary] = useState<boolean>()

  useEffect(() => {
    (async () => {
      const userId = await getUserIdAsync({
        throwOnError: true
      })
      const { data } = await supabase
        .from("summaries")
        .select("*")
        .eq("owner", userId!)
      setHasSummary(data?.length ?? 0 > 1 ? true : false)
      setIsLoading(false)
    })()
  }, [])

  if (isLoading || hasSummary) return null

  return (
    <TouchableOpacity
      onPress={() => sampleModalRef.current?.toggle()}
    >
      <ThemedText size={"sm"} color={"themePrimary"}>
        don't have a pdf? try our sample pdf
      </ThemedText>
    </TouchableOpacity>
  )
}

const ErrorModal = () => {

  const { errorMessage, setErrorMessage } = useSummaryCreation()

  return <ThemedAlert
    text={errorMessage!}
    title={"error"}
    visible={!!errorMessage}
    primaryAction={{
      title: "Got it",
      onDispatch: () => setErrorMessage(undefined)
    }}
  />

}

const styles = StyleSheet.create(theme => ({
  attachmentInput: {
    height: 40,
    borderRadius: theme.spacing.md
  },
  attachmentInputsContainer: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    alignItems: "center"
  },
  buttonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: "bold"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  descriptionInput: {
    padding: theme.spacing.sm,
    textAlignVertical: 'top',
    minHeight: (theme.fontSize.xs * 3) + 24
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.spacing.sm,
    variants: {
      attachment: {
        true: {
          borderRadius: theme.radii.pill,
          flex: 1
        }
      }
    }
  },
  screen: {
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.sm
  },
  submitButton: {
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg
  },
  requiredInput: {
    variants: {
      empty: {
        true: {
          borderColor: theme.colors.error
        }
      }
    }
  },
}))
