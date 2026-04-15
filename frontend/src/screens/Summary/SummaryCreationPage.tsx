import { AttachmentInputButton, ThemedScreen, ThemedText, ThemedTextInput } from "@/src/components";
import React, { useCallback, useState } from "react";
import * as DocumentPicket from "expo-document-picker"
import * as FileSystem from "expo-file-system"
import { decode } from "base64-arraybuffer";
import getFileSize from "@/src/utils/FileSystem/getFileSize";
import { Alert, Keyboard, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import * as ImagePicker from "expo-image-picker"
import ActionButton, { AnimatedActionButton } from "@/src/components/ActionButton";
import { useMutation } from "@tanstack/react-query";
import createNewSummary from "@/src/api/services/summaries/createNewSummary";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SummaryStackParamList } from "@/src/navigation/Summary/types";
import { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { requestSummary } from "@/src/api/services/summaries";
import SamplePdfModal from "./components/SamplePdfModal";
import SummaryCreationContextProvider, { useSummaryCreation } from "./context/SummaryCreationPageContext";
import useQueryUpdater from "@/src/api/hooks/useQueryUpdater";
import { Summary } from "@/src/api/types/summary";

const MaxDocumentSize = 5 * 1024 * 1024

export default function SummaryCreationPage() {

  return (
    <SummaryCreationContextProvider>
      <ThemedScreen style={styles.screen}>
        <TitleInput />
        <DocumentInput />
        <ThemedText
          size={"xs"}
          color={"secondary"}
          style={{ marginTop: 8 }}
        >
          optional fields
        </ThemedText>
        <DescriptionInput />
        <CoverInput />
        <SamplePdfModalButton />
        <SubmitButton />
        <SamplePdfModal />
      </ThemedScreen>
    </SummaryCreationContextProvider>
  )
}

const TitleInput = () => {

  const [focused, setFocused] = useState(false)
  const { title, setTitle } = useSummaryCreation()
  styles.useVariants({ focused })

  return <ThemedTextInput
    value={title}
    style={styles.textInputs}
    onFocus={() => setFocused(true)}
    onBlur={() => setFocused(false)}
    onChangeText={setTitle}
    placeholder={"title of the summmary"}
    autoFocus={true}
  />
}

const DocumentInput = () => {

  const { document, setDocument } = useSummaryCreation()

  const pickDocument = useCallback(async () => {

    const { assets, canceled } = await DocumentPicket.getDocumentAsync({
      base64: false,
      multiple: false
    })

    if (canceled || assets.length < 1) return;

    const chosenDocument = assets[0]
    let size = chosenDocument.size ?? null
    if (size === null) {
      size = await getFileSize({ uri: chosenDocument.uri })
    }
    if (!size || size > MaxDocumentSize) {
      Alert.alert("an error has occured")
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
      placeholder={"Attach PDF to summarize"}
      selectedFileName={document?.title ?? undefined}
      onPress={() => { document ? setDocument(null) : pickDocument() }}
    />
  )
}

const DescriptionInput = () => {

  const { description, setDescription } = useSummaryCreation()
  const [focused, setFocused] = useState(false)
  styles.useVariants({ focused })

  return (
    <ThemedTextInput
      value={description}
      onChangeText={setDescription}
      placeholder={"provide a description for this summary..."}
      multiline={true}
      numberOfLines={3}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.descriptionInput, styles.textInputs]}
    />
  )
}

const CoverInput = () => {

  const { cover, setCover } = useSummaryCreation()

  const pickImage = useCallback(async () => {
    const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: false,
      aspect: [9, 12]
    })
    if (canceled || assets.length < 1) {
      throw new Error("an error has occured")
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
    />
  )
}

const SubmitButton = () => {

  const navigation = useNavigation<NavigationProp<SummaryStackParamList>>()
  const keyboard = useAnimatedKeyboard()
  const {
    title,
    description,
    cover,
    document,
    mutating,
    setMutating
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
    onError: e => console.log(e)
  })

  const handleSubmit = useCallback(() => {
    if (document && title) {
      mutate()
    }
  }, [cover, description, document, title])

  const rStyles = useAnimatedStyle(() => ({
    transform: [
      { translateY: keyboard.height.value > 0 ? -keyboard.height.value : 0 }
    ]
  }))

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
      style={[styles.submitButton, rStyles]}
    />
  )
}

const SamplePdfModalButton = () => {

  const { sampleModalRef } = useSummaryCreation()

  return (
    <TouchableOpacity onPress={() => sampleModalRef.current?.toggle()}>
      <ThemedText size={"sm"} color={"themePrimary"}>
        don't have a pdf? try our sample pdf
      </ThemedText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create(theme => ({
  buttonText: {
    fontSize: theme.fontSize.lg
  },
  descriptionInput: {
    padding: theme.spacing.sm,
    textAlignVertical: 'top',
    minHeight: (theme.fontSize.xs * 3) + 24
  },
  screen: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm
  },
  submitButton: {
    borderRadius: theme.radii.pill,
    position: 'absolute',
    right: theme.spacing.sm,
    left: theme.spacing.sm,
    bottom: theme.spacing.sm
  },
  textInputs: {
    borderRadius: theme.radii.xs,
    variants: {
      focused: {
        true: {
          borderColor: theme.colors.primary
        }
      }
    }
  }
}))
