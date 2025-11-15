import { AttachmentInputButton, ThemedScreen, ThemedText, ThemedTextInput } from "@/src/components";
import React, { useCallback, useState } from "react";
import * as DocumentPicket from "expo-document-picker"
import * as FileSystem from "expo-file-system"
import { decode } from "base64-arraybuffer";
import getFileSize from "@/src/utils/FileSystem/getFileSize";
import useEffectAfterMount from "@/src/hooks/useEffectAfterMount";
import { Alert, Keyboard } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import * as ImagePicker from "expo-image-picker"
import ActionButton, { AnimatedActionButton } from "@/src/components/ActionButton";
import { useMutation } from "@tanstack/react-query";
import createNewSummary from "@/src/api/services/summaries/createNewSummary";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SummaryStackParamList } from "@/src/navigation/Summary/types";
import { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";


const MaxDocumentSize = 5 * 1024 * 1024

type ReactStateSetter<T> = React.Dispatch<React.SetStateAction<T>>

type PageState = {
  title: string;
  description: string;
  document: { file: ArrayBuffer; title: string } | null;
  cover: { file: ArrayBuffer; fileName: string } | null;
  mutating: boolean
}

type PageStateAndSetter = PageState & {
  setTitle: ReactStateSetter<PageState['title']>;
  setDocument: ReactStateSetter<PageState['document']>;
  setDescription: ReactStateSetter<PageState['description']>;
  setCover: ReactStateSetter<PageState['cover']>;
  setMutating: ReactStateSetter<PageState['mutating']>
}

export default function SummaryCreationPage() {

  const [title, setTitle] = useState<PageState['title']>('')
  const [document, setDocument] = useState<PageState['document']>(null)
  const [description, setDescription] = useState<PageState['description']>('')
  const [cover, setCover] = useState<PageState['cover']>(null)
  const [mutating, setMutating] = useState<PageState['mutating']>(false)

  return (
    <ThemedScreen style={styles.screen}>
      <TitleInput setTitle={setTitle} title={title} />
      <DocumentInput
        document={document}
        setDocument={setDocument}
      />
      <ThemedText
        size={"xs"}
        color={"secondary"}
        style={{ marginTop: 8 }}
      >
        optional fields
      </ThemedText>
      <DescriptionInput
        description={description}
        setDescription={setDescription}
      />
      <CoverInput
        cover={cover}
        setCover={setCover}
      />
      <SubmitButton
        setMutating={setMutating}
        mutating={mutating}
        cover={cover}
        description={description}
        document={document}
        title={title}
      />
    </ThemedScreen>
  )
}

const TitleInput = React.memo(({
  setTitle,
  title,
  mutating
}: Pick<PageStateAndSetter, 'setTitle' | 'title' | 'mutating'>
) => {

  const [focused, setFocused] = useState(false)
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

})

const DocumentInput = React.memo(({
  document,
  setDocument
}: Pick<PageStateAndSetter, 'document' | 'setDocument'>
) => {

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
})

const DescriptionInput = React.memo(({
  description,
  setDescription
}: Pick<PageStateAndSetter, 'description' | 'setDescription'>
) => {

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
})

const CoverInput = React.memo(({
  cover,
  setCover
}: Pick<PageStateAndSetter, 'cover' | 'setCover'>
) => {

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
})

const SubmitButton = React.memo(({
  cover,
  description,
  document,
  title,
  mutating,
  setMutating
}: PageState & Pick<PageStateAndSetter, 'setMutating'>) => {

  const navigation = useNavigation<NavigationProp<SummaryStackParamList>>()
  const keyboard = useAnimatedKeyboard()

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
    onSettled: () => setMutating(false)
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

  return (
    <AnimatedActionButton
      status={status}
      title={"submit"}
      onPress={handleSubmit}
      disabled={!document || !title || mutating}
      textStyle={styles.buttonText}
      style={[styles.submitButton, rStyles]}
    />
  )
})


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
