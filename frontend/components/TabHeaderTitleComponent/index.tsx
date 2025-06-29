import { Image } from "expo-image"
import { StyleSheet, useColorScheme, View } from "react-native"
import { ThemedText } from "../ui"

const Icons = {
  light: require('@/assets/images/icon-light.png'),
  dark: require('@/assets/images/icon-dark.png'),
}

export default function TabHeaderTitleComponent() {

  const colorScheme = useColorScheme()

  return (
    <View style={styles.headerTitleContainer}>
      <Image
        source={Icons[colorScheme ?? 'light']}
        style={styles.headerTitleImage}
        contentFit="contain"
      />
      <ThemedText style={styles.headerTitleText}>
        Cut D' Crop!
      </ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerTitleImage: {
    height: 50,
    aspectRatio: 1,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 600,
  },
})
