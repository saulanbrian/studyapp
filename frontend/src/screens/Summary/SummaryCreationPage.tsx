import createAxiosInstance from "@/src/api";
import { AttachmentInputButton, ThemedAlert, ThemedScreen, ThemedText, ThemedTextInput, ThemedView } from "@/src/components";
import ThemedButton from "@/src/components/ThemedButton";
import { AnimatedThemedView } from "@/src/components/ThemedView";
import { S } from "@/src/constants/Styles";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { TextInput, View, Keyboard } from "react-native";
import { KeyboardState, useAnimatedKeyboard, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import SummaryCreationPageContextProvider, { useSummaryCreationPageContext } from "@/src/context/Summary/SummaryCreationPageContext";
import { useNavigation } from "expo-router";
import { SummaryNavigationProp } from "@/src/navigation/Summary/types";
import useSummaryUpdater from "@/src/api/updaters/summary";
import ActionButton from "@/src/components/ActionButton";

const PDFPickingTips = [
  "1. make sure it's mainly text-based ( no image support for now)",
  "2. make sure the content is not very large",
  "3. maximum file size is 5mb"
]

export default function SummaryCreationPage() {

  return (
    <SummaryCreationPageContextProvider>
      <ThemedScreen style={styles.container}>
        <ThemedView style={styles.form}>
          <StatementHeader />
          <Inputs />
          <Tips />
        </ThemedView>
        <SubmitButton />
      </ThemedScreen>
    </SummaryCreationPageContextProvider>
  )
}

const StatementHeader = () => {

  return (
    <View >
      <ThemedText fw={"bold"} size={"xl"}>
        Summarize your File
      </ThemedText>
      <ThemedText size={"sm"} color={"secondary"}>
        get rid of the unnecessary details and learn in less time
      </ThemedText>
    </View>
  )
}


const Inputs = () => {

  const {
    clearError,
    pickPdf,
    removePdf,
    setTitle,
    assetError,
    pdf,
    title
  } = useSummaryCreationPageContext()

  const handlePress = useCallback(() => {
    pdf ? removePdf() : pickPdf()
  }, [pdf])

  return (
    <View style={[styles.formSection, styles.inputContainer]}>
      <ThemedTextInput
        placeholder={"provide title for the summary"}
        value={title}
        onChangeText={setTitle}
      />
      <AttachmentInputButton
        onPress={handlePress}
        selectedFileName={pdf?.name}
      />
      <ThemedAlert
        visible={!!assetError}
        text={assetError!}
        primaryAction={{
          title: "close",
          onDispatch: clearError
        }}
      />
    </View>
  )
}

const Tips = () => {

  return (
    <View >
      <ThemedText
        size={"sm"}
        style={{ marginLeft: -6 }}
      >
        💡Tips on picking your pdf:
      </ThemedText>
      {PDFPickingTips.map((tip, i) => (
        <ThemedText size={"xs"} color={"secondary"} key={i.toString()}>
          {tip}
        </ThemedText>
      ))}
    </View>
  )
}


const SubmitButton = () => {

  const { getToken } = useAuth()
  const { addToSummaries } = useSummaryUpdater()
  const { title, pdf } = useSummaryCreationPageContext()
  const keyboard = useAnimatedKeyboard()
  const navigation = useNavigation<SummaryNavigationProp>()

  const { isPending, mutate, status } = useMutation({
    mutationFn: async (data: FormData) => {
      const token = await getToken()
      const api = createAxiosInstance({ token })
      const res = await api.post("summary/", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      return res.data
    },
    onSuccess: (data) => {
      addToSummaries(data)
      setTimeout(() => {
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("SummaryList")
      }, 1000)
    },
    onMutate: Keyboard.dismiss
  })

  const handleSubmit = useCallback(() => {
    if (isPending || !pdf || !title) return

    const formData = new FormData()

    formData.append('file', {
      type: pdf.mimeType || "application/pdf",
      uri: pdf.uri,
      name: pdf.name
    } as any)

    formData.append('title', title)

    mutate(formData)

  }, [isPending, pdf, title])


  const rStyles = useAnimatedStyle(() => ({
    transform: [
      { translateY: -keyboard.height.value }
    ]
  }))

  return (
    <AnimatedThemedView style={[styles.buttonContainer, rStyles]}>
      <ActionButton
        disabled={!title || !pdf || isPending}
        title={isPending ? "pending..." : "summarize"}
        textStyle={styles.buttonText}
        style={styles.button}
        onPress={handleSubmit}
        status={status}
      />
    </AnimatedThemedView>
  )
}

const styles = StyleSheet.create(theme => ({
  button: {
    borderRadius: theme.radii.pill,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    right: theme.spacing.md
  },
  buttonText: {
    letterSpacing: 2,
    textAlign: "center"
  },
  container: {
    paddingVertical: theme.spacing.sm,
    flex: 1,
  },
  form: {
    padding: theme.spacing.xs,
    gap: theme.spacing.sm
  },
  formSection: {
    gap: theme.spacing.xs
  },
  inputContainer: {
    marginLeft: -4,
    paddingVertical: theme.spacing.xs
  },
  titleInput: {
    backgroundColor: "red",
    width: "100%"
  }
}))
