import { LoadingScreen, ThemedText, ThemedView, TransparentModalView } from "@/src/components";
import { useSummaryCreation } from "../context/SummaryCreationPageContext";
import { Alert, Dimensions, TouchableOpacity, View } from "react-native";
import Pdf from "react-native-pdf";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/supabase/client";
import RNFetchBlob from "react-native-blob-util";
import { StyleSheet } from "react-native-unistyles";
import { darkColors } from "@/src/constants/ui/Colors";
import ActionButton from "@/src/components/ActionButton";
import { useMutation } from "@tanstack/react-query";
import getUserIdAsync from "@/src/api/services/auth/getUserIdAsync";
import { Summary } from "@/src/api/types/summary";
import useQueryUpdater from "@/src/api/hooks/useQueryUpdater";
import { useNavigation } from "@react-navigation/native";
import { requestSummary } from "@/src/api/services/summaries";

export default function SamplePdfModal() {

  const { sampleModalRef } = useSummaryCreation()

  return (
    <TransparentModalView ref={sampleModalRef}>
      <View style={styles.container}>
        <ThemedText
          size={"lg"}
          fw={"bold"}
          style={styles.title}
        >
          Sample Pdf
        </ThemedText>
        <PdfContent />
        <TryButton />
      </View>
    </TransparentModalView>
  )
}


const PdfContent = () => {

  const [localPath, setLocalPath] = useState<string>()

  useEffect(() => {
    const uri = supabase.storage
      .from("summary_bucket")
      .getPublicUrl("sample.pdf")
      .data
      .publicUrl
    RNFetchBlob
      .config({
        appendExt: 'pdf',
        fileCache: true
      })
      .fetch("GET", uri)
      .then(data => {
        setLocalPath(data.path)
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  if (!localPath) return (
    <ThemedView style={styles.pdfContainer}>
      <LoadingScreen />
    </ThemedView>
  )

  return (
    <ThemedView>
      <Pdf
        source={{ uri: localPath }}
        trustAllCerts
        style={styles.pdfContainer}
      />
    </ThemedView>)
}

const TryButton = () => {

  const { sampleModalRef } = useSummaryCreation()
  const { insertIntoInfiniteQuery, updateDataFromInfiniteQuery } = useQueryUpdater<Summary>()
  const navigation = useNavigation()

  const { status, mutate } = useMutation<Summary>({
    mutationFn: async () => {
      const userId = await getUserIdAsync({ throwOnError: true })
      const { data, error } = await supabase
        .from("summaries")
        .insert({
          owner: userId!,
          document_url: "sample.pdf",
          title: "sample pdf",
        })
        .select("*,quizzes(id)")
        .single()
      if (error || !data) throw error
      return {
        ...data,
        quizId: data.quizzes?.id ?? null
      }
    },
    onSuccess: summary => {
      insertIntoInfiniteQuery({
        newData: summary,
        queryKey: ["summaries"]
      })
      requestForSummary(summary.id)
      sampleModalRef.current?.toggle()
      navigation.goBack()
    },
    onError: e => {
      console.log(e)
    }
  })

  const requestForSummary = useCallback(async (id: string) => {
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

  return <ActionButton
    onPress={() => mutate()}
    title={"Try Now"}
    status={status}
    style={styles.tryButton}
  />
}

const styles = StyleSheet.create(theme => ({
  container: {
    gap: theme.spacing.xs
  },
  pdfContainer: {
    height: Dimensions.get('window').height * 0.5,
    width: Dimensions.get('window').width * 0.8
  },
  title: {
    color: darkColors.textPrimary
  },
  tryButton: {
    borderRadius: theme.radii.pill
  }
}))
