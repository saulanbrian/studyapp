import { Summary } from "@/types/data";
import { Card, ThemedText, ThemedView } from "../ui";
import { Image } from 'expo-image'
import { Dimensions, StyleSheet, TouchableOpacity, ViewProps, ActivityIndicator, View, TouchableOpacityProps } from "react-native";
import { useThemeContext } from "@/context/Theme";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { useCallback } from "react";
import { useRetrySummarization } from "@/api/mutations/summary";
import { MaterialIcons } from "@expo/vector-icons";


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

  const renderImage = useCallback(() => {
    if (status === 'processed') return (
      <Image
        source={cover}
        placeholder={require('@/assets/images/placeholder-image.png')}
        style={styles.image}
      />
    )
  }, [status, cover])

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: theme.surface,
          borderColor: theme.textSecondary
        },
        styles.container, style
      ]}
      disabled={status !== 'processed'}
      onPress={() => router.push({
        pathname: '/(summary)/[id]',
        params: { id, title }
      })}
      {...props}
    >
      <ThemedView style={[
        { borderColor: theme.textSecondary },
        styles.statusContainer]}
      >
        {renderImage()}
        {renderLoadingView()}
        {renderErrorView()}
      </ThemedView>
      <ThemedText style={styles.title} numberOfLines={1}>{title}</ThemedText>
    </TouchableOpacity>
  )
}

const LoadingView = () => {
  return (
    <ThemedView style={styles.autoCenter} surface>
      <ThemedText secondary>processing...</ThemedText>
      <ActivityIndicator />
    </ThemedView>
  )
}


const ErrorView = ({ id }: { id: string }) => {

  const { theme } = useThemeContext()
  const { mutate: retry, isPending } = useRetrySummarization()

  return (
    <ThemedView style={styles.autoCenter} surface>
      <ThemedText style={[{ color: theme.error }, styles.errorText]}>
        ⚠️an error has occured. please try again
      </ThemedText>
      <TouchableOpacity onPress={() => retry(id)} style={styles.retryButton}>
        {isPending
          ? <ActivityIndicator />
          : <MaterialIcons
            name='refresh'
            color={theme.textPrimary}
            size={20}
          />
        }
      </TouchableOpacity>
    </ThemedView>
  )
}


const styles = StyleSheet.create({
  autoCenter: {
    borderRadius: 8,
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    padding: 8,
    gap: 4,
    borderRadius: 8,
    borderWidth: 1
  },
  errorText: {
    fontWeight: 'regular',
    textAlign: 'center',
    fontSize: 12,
  },
  image: {
    borderRadius: 8,
    width: "auto",
    flex: 1,
    objectFit: 'fill'
  },
  retryButton: {
    position: 'absolute',
    right: 4,
    top: 2
  },
  statusContainer: {
    height: 200,
    borderRadius: 8,
    borderWidth: 1
  },
  title: {
    fontWeight: 'semibold',
    paddingHorizontal: 2
  }
})
