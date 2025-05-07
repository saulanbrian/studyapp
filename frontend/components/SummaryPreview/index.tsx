import { Summary } from "@/types/data";
import { Card, ThemedText, ThemedView } from "../ui";
import { Image } from 'expo-image'
import { Dimensions, StyleSheet, TouchableOpacity, ViewProps, ActivityIndicator, View } from "react-native";
import { useThemeContext } from "@/context/Theme";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";


type SummaryPreviewProps = Summary & ViewProps

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

  return (
    <Card style={[styles.container, style]} {...props}>
      <TouchableOpacity
        disabled={status !== 'processed'}
        onPress={() => router.push({ pathname: '/(summary)/[id]', params: { id: id } })}
      >
        <Image source={{ uri: cover }} placeholder={require('@/assets/images/pdf.png')} style={styles.image} />
        <ThemedText style={styles.title} numberOfLines={1}>{title}</ThemedText>
      </TouchableOpacity>
      {status !== 'processed' && (
        <BlurView style={styles.blur}>
          <ThemedText>processing</ThemedText>
          <ActivityIndicator />
        </BlurView>
      )}
    </Card>
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
    gap: 4
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
