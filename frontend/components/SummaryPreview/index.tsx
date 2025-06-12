import { Summary } from "@/types/data";
import { Card, ThemedText, ThemedView } from "../ui";
import { Image } from 'expo-image'
import { Dimensions, StyleSheet, TouchableOpacity, ViewProps, ActivityIndicator, View, TouchableOpacityProps } from "react-native";
import { useThemeContext } from "@/context/Theme";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { useCallback } from "react";
import { useRetrySummarization } from "@/api/mutations/summary";


type SummaryPreviewProps = Summary & Omit<TouchableOpacityProps, 'onPress'>

export default function SummaryPreview({
  title,
  status,
  content,
  cover,
  style,
  id,
  ...props
}: SummaryPreviewProps) {

  const { theme } = useThemeContext()
  const router = useRouter()

  const renderLoadingView = useCallback(() => {
    if (status === 'processing') return <LoadingView />
  }, [status])


  const renderErrorView = useCallback(() => {
    if (status === 'error') return <ErrorView id={id} />
  }, [status])

  return (
    <TouchableOpacity
      style={[{ backgroundColor: theme.surface }, styles.container, style]}
      disabled={status !== 'processed'}
      onPress={() => router.push({ pathname: '/(summary)/[id]', params: { id: id } })}
      {...props}
    >
      <Image
        source={cover}
        placeholder={require('@/assets/images/pdf.png')}
        style={styles.image}
      />
      <ThemedText style={styles.title} numberOfLines={1}>{title}</ThemedText>
      {renderErrorView()}
      {renderLoadingView()}
    </TouchableOpacity>
  )
}

const LoadingView = () => {
  return (
    <ThemedView style={styles.blur} surface>
      <ThemedText>processing...</ThemedText>
      <ActivityIndicator />
    </ThemedView>
  )
}


const ErrorView = ({ id }: { id: string }) => {

  const { theme } = useThemeContext()
  const { mutate: retry } = useRetrySummarization()

  return (
    <ThemedView style={styles.blur} surface>
      <ThemedText style={{ color: theme.error }}>error</ThemedText>
      <TouchableOpacity onPress={() => retry(id)}>
        <ThemedText>retry</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )
}


const styles = StyleSheet.create({
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    padding: 8,
    gap: 4,
    borderRadius: 8
  },
  image: {
    borderRadius: 8,
    width: "auto",
    height: 240,
  },
  title: {
    fontSize: 12,
    fontWeight: 'semibold'
  }
})
