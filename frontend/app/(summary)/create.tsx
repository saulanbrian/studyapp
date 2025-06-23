import { useUploadFileToSummarize } from "@/api/mutations/summary"
import { Card, SubmitButton, ThemedButton, ThemedInput, ThemedText, ThemedView } from "@/components/ui"
import SummaryCreationPageProvider, { useSummaryCreationPage } from "@/context/SummaryCreationPageContext"
import { useThemeContext } from "@/context/Theme"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { getDocumentAsync } from "expo-document-picker"
import { useNavigation, useRouter } from "expo-router"
import { useCallback, useEffect } from "react"
import { Pressable, TouchableOpacity, View, StyleSheet, Text, Alert, TextInput, useWindowDimensions, ActivityIndicator } from "react-native"
import Animated, { useAnimatedKeyboard, useAnimatedStyle, withDelay, withSpring, withTiming } from "react-native-reanimated"
import * as FileSystem from 'expo-file-system'
import { useQueryClient } from "@tanstack/react-query"
import MaterialAttachmentInputButton from "@/components/ui/MaterialAttachmentInputButton"
import { EventArg } from "@react-navigation/native"
import * as ImagePicker from 'expo-image-picker'
import { isAxiosError } from "axios"

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024


export default function InitialPage() {
  return (
    <SummaryCreationPageProvider>
      <SummaryCreationPage />
    </SummaryCreationPageProvider>
  )
}

function SummaryCreationPage() {

  const { theme } = useThemeContext()
  const { document, formStatus, setDocument, error } = useSummaryCreationPage()
  const navigation = useNavigation()

  useEffect(() => {

    const beforeRemoveListener = navigation.addListener('beforeRemove', e => {
      if (!!document && formStatus !== 'success') {
        e.preventDefault()
      }
    })

    return beforeRemoveListener

  }, [document, formStatus])

  const handlePress = useCallback(async () => {
    const { assets, canceled } = await getDocumentAsync()
    if (!canceled) {
      let { size, uri } = assets[0]
      if (!size) {
        const fileInfo = await FileSystem.getInfoAsync(uri)
        if (fileInfo.exists) {
          size = fileInfo.size
        }
      }
      if (size && size <= MAX_DOCUMENT_SIZE) {
        setDocument(assets[0])
      }
    }
  }, [])

  return (
    <ThemedView style={styles.container}>
      <MaterialAttachmentInputButton
        materialIconName="file-upload"
        inputTitle="upload pdf file"
        onPress={handlePress}
        onClickRemove={() => setDocument(null)}
        placeholder='select a pdf file no bigger than 5mb'
        attachmentName={document && document.name}
        iconProps={{ size: 16 }}
      />
      <OptionalFields />
      <DocumentPickingTips />
      <SubmitButtonContainer />
    </ThemedView>
  )
}


const OptionalFields = () => {

  const { setTitle, setImage, image } = useSummaryCreationPage()

  const handleSelectImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync()
    if (!res.canceled) {
      setImage(res.assets[0])
    }
  }

  return (
    <ThemedView style={styles.optionalFieldsContainer}>
      <ThemedText secondary style={{ marginLeft: 2 }}>
        optional
      </ThemedText>
      <ThemedInput
        placeholder="custom document title"
        style={styles.input}
        onChangeText={setTitle}
      />
      <MaterialAttachmentInputButton
        inputTitle="add cover image"
        materialIconName="image-search"
        onPress={handleSelectImage}
        onClickRemove={() => setImage(null)}
        attachmentName={!!image ? image?.fileName || 'image.jpg' : undefined}
      />
    </ThemedView>
  )
}


const SubmitButtonContainer = () => {

  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true })
  const { width } = useWindowDimensions()
  const { setError } = useSummaryCreationPage()
  const { document, title, setFormStatus, image } = useSummaryCreationPage()
  const { mutate, status, data, error, failureReason } = useUploadFileToSummarize()
  const router = useRouter()

  useEffect(() => {
    setFormStatus(status)
    if (status === 'success') {
      setTimeout(() => {
        router.back()
      }, 500)
    }
  }, [status])

  const rStyles = useAnimatedStyle(() => ({
    position: 'absolute',
    bottom: 2,
    width,
    padding: 8,
    transform: [
      {
        translateY: withSpring(
          -keyboard.height.value,
          {
            damping: 30,
            stiffness: 200
          }
        )
      }
    ]
  }))

  const handlePress = useCallback(() => {
    if (!document) return

    mutate({ title, image, file: document, })

  }, [document, title, image])


  return (
    <Animated.View style={rStyles}>
      <SubmitButton
        label='summarize'
        status={status}
        onPress={handlePress}
        disabled={status === 'success' || status === 'pending' || !document}
      />
    </Animated.View>
  )
}


const DocumentPickingTips = () => {
  return (
    <ThemedView style={styles.documentPickingTipsContainter}>
      <ThemedText
        style={styles.documentPickingTipsHeader}
        secondary
      >
        💡Tips on Picking your Document:
      </ThemedText>
      <ThemedText secondary style={styles.tipMessage}>
        • make sure it's in pdf format
      </ThemedText>
      <ThemedText secondary style={styles.tipMessage}>
        • make sure its text-based ( no image support for now)
      </ThemedText>
      <ThemedText secondary style={styles.tipMessage}>
        • choose a file that actually contains informations
      </ThemedText>
      <ThemedText secondary style={styles.tipMessage}>
        • do not upload a file that has a very long content
      </ThemedText>
      <ThemedText
        secondary
        style={{ marginTop: 8 }}
      >
        set a cover image and a custom title
        specially when you have a large amount of documents
        to better recognize 'em
      </ThemedText>
    </ThemedView>
  )
}


const styles = StyleSheet.create({
  attachmentButton: {
    alignSelf: 'flex-start',
    padding: 8,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    gap: 4,
    paddingRight: 12
  },
  container: {
    flex: 1,
    padding: 8
  },
  documentPickingTipsContainter: {
    padding: 4,
    paddingLeft: 6
  },
  documentPickingTipsHeader: {
    marginLeft: -6,
    marginVertical: 8,
    fontSize: 20
  },
  fileUploadContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  formText: {
    fontSize: 12
  },
  icon: {
    fontWeight: 'bold',
  },
  input: {
    fontSize: 12,
    borderRadius: 36
  },
  optionalFieldsContainer: {
    paddingTop: 16,
    gap: 8
  },
  submitButton: {
    padding: 8,
    borderRadius: 30
  },
  submitButtonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2
  },
  tipMessage: {
    marginLeft: 2,
    fontSize: 12,
    fontWeight: 'regular'
  }
})
