import { Image, ImageProps } from "expo-image";
import { StyleSheet } from "react-native-unistyles";

type AppLogoProps = Omit<ImageProps, "source">


export default function AppLogo() {

  return <Image
    source={require("@/assets/images/icon.png")}
    cachePolicy={"memory-disk"}
    contentFit="contain"
    style={styles.image}
  />
}

const styles = StyleSheet.create(theme => ({
  image: {
    height: 40,
    aspectRatio: 1,
    borderRadius: theme.spacing.sm
  }
}))
