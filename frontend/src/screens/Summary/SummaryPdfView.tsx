import { useGetSummary } from "@/src/api/queries/summaries";
import { LoadingScreen, ThemedScreen, ThemedText, ThemedView } from "@/src/components";
import { SummaryNavigationProp, SummaryStackParamList } from "@/src/navigation/Summary/types";
import { supabase } from "@/supabase/client";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Suspense, useEffect, useMemo, useState } from "react";
import Pdf from "react-native-pdf"
import RNFetchBlob from "react-native-blob-util"
import { useDrawer } from "@/src/context/DrawerContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";


type _RouteProp = RouteProp<SummaryStackParamList, "SummaryPdfView">

export default function SummaryPdfView() {

  const { params: { summaryId } } = useRoute<_RouteProp>()
  const { setOptions } = useDrawer()

  useEffect(() => {
    setOptions({ swipeEnabled: false })

    return () => {
      setOptions({ swipeEnabled: true })
    }
  }, [])

  return (
    <ThemedScreen style={{ flex: 1, paddingHorizontal: 0 }}>
      <CustomHeader />
      <Suspense>
        <Content id={summaryId} />
      </Suspense>
    </ThemedScreen>
  )
}

const Content = ({ id }: { id: string }) => {

  const { data: summary } = useGetSummary(id)
  const [localPath, setLocalPath] = useState<string>()

  useEffect(() => {
    const uri = supabase
      .storage
      .from("summary_bucket")
      .getPublicUrl(summary.document_url)
      .data
      .publicUrl
    RNFetchBlob
      .config({
        appendExt: "pdf",
        fileCache: true
      })
      .fetch("GET", uri)
      .then(data => {
        setLocalPath(data.path())
      })
      .catch(e => {
        console.log(e)
      })

  }, [summary])

  if (!localPath) return <LoadingScreen />

  return (
    <Pdf
      source={{ uri: localPath }}
      style={{ flex: 1 }}
      trustAllCerts
    />
  )
}

const CustomHeader = () => {

  const { colors: { textPrimary } } = useUnistyles().theme
  const navigation = useNavigation<SummaryNavigationProp>()
  const { top } = useSafeAreaInsets()

  return (
    <ThemedView
      style={[styles.header, { paddingTop: top }]}
      surface
    >
      <Ionicons
        name={"arrow-back"}
        color={textPrimary}
        size={20}
        onPress={navigation.goBack}
      />
      <ThemedText>back</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create(theme => ({
  header: {
    flexDirection: "row",
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: "center",
    height: 80
  }
}))
