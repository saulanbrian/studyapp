import { FontAwesome } from "@expo/vector-icons";
import { Pressable, TouchableOpacity, TouchableOpacityProps } from "react-native";
import Animated from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ThemedText from "./ThemedText";

type AttachmentInputButtonProps = TouchableOpacityProps & {
  selectedFileName?: string;
  placeholder?:string
}

export default function AttachmentInputButton({
  selectedFileName,
  style,
  placeholder,
  ...props
}: AttachmentInputButtonProps) {

  const { colors } = useUnistyles().theme

  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <FontAwesome
        name={"file-text"}
        color={selectedFileName ? colors.textPrimary : colors.textDisabled}
      />
      <ThemedText
        color={selectedFileName ? "primary" : "disabled"}
        size={selectedFileName ? "xs" : "sm"}
        numberOfLines={1}
      >
        {selectedFileName 
          ? selectedFileName
          : placeholder ?? "No file selected"
        }
      </ThemedText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create(theme => ({
  container: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.pill,
    flexDirection: "row",
    padding: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
}))
