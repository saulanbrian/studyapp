import { Ionicons } from "@expo/vector-icons";
import ThemedView from "./ThemedView";
import { StyleSheet } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { useColorScheme } from "react-native";
import { darkColors, lightColors } from "../constants/ui/Colors";

export default function BackScreenHeader() {

  const { top } = useSafeAreaInsets()
  const navigation = useNavigation()
  const scheme = useColorScheme()

  const handlePress = useCallback(() => {
    navigation.goBack()
  }, [])

  return (
    <ThemedView style={[
      styles.header,
      {
        paddingTop: top
      }
    ]}>
      <Ionicons
        name={"arrow-back-circle"}
        size={28}
        onPress={handlePress}
        color={
          scheme === "light"
            ? lightColors.textPrimary
            : darkColors.textPrimary
        }
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create(theme => ({
  header: {
    width: "100%",
    paddingHorizontal: theme.spacing.sm,
    paddingLeft: theme.spacing.sm,
    paddingBottom: theme.spacing.lg * 0.8
  }
}))
