import { View, ViewProps } from "react-native";
import AppLogo from "./AppLogo";
import ThemedText from "./ThemedText";
import { StyleSheet } from "react-native-unistyles";
import { darkColors } from "../constants/ui/Colors";
import { StackHeaderProps } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppHeader({
  layout: { height },
}: StackHeaderProps) {

  const { top } = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        {
          minHeight: 100,
          paddingTop: top
        }
      ]}
    >
      <AppLogo />
      <ThemedText
        style={styles.text}
        size={"lg"}
        fw={"semiBold"}
      >
        Cut D' Crop
      </ThemedText>
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: "center",
    backgroundColor: theme.colors.primaryDark,
  },
  text: {
    color: darkColors.textPrimary
  }
}))
