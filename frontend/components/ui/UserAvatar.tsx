import { StyleSheet } from "react-native"
import ThemedView from "./ThemedView"
import { Image } from "expo-image"
import { useUser } from "@clerk/clerk-expo"

export default function UserAvatar() {

  const { user } = useUser()

  return (
    <ThemedView style={styles.container}>
      <Image
        source={{
          uri: user?.imageUrl || require('@/assets/images/blank_profile.jpeg')
        }}
        style={styles.image}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 360,
    overflow: 'hidden'
  },
  image: {
    objectFit: 'cover',
    aspectRatio: 1,
    height: 40,
  }
})
