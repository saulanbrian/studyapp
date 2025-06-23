import { StyleSheet, TouchableOpacity, ViewProps } from "react-native"
import ThemedView from "./ThemedView"
import { MaterialIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { useThemeContext } from "@/context/Theme";
import Card from "./Card";
import ThemedText from "./ThemedText";


type MaterialAttachmentInputButtonProps = ViewProps & {
  inputTitle: string;
  placeholder?: string;
  attachmentName?: string | null;
  onPress: () => void;
  materialIconName: ComponentProps<typeof MaterialIcons>['name'];
  iconProps?: Omit<ComponentProps<typeof MaterialIcons>, 'name' | 'onPress'>;
  onClickRemove: () => void;
}

const MaterialAttachmentInputButton = ({
  attachmentName,
  inputTitle,
  placeholder,
  materialIconName,
  onPress,
  onClickRemove,
  iconProps,
  style,
  ...props
}: MaterialAttachmentInputButtonProps) => {

  const { theme } = useThemeContext()

  return (
    <ThemedView style={[styles.container, style]} {...props}>
      <Card style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onPress}
          style={[
            { flexDirection: !attachmentName ? 'row-reverse' : 'row' },
            styles.button
          ]}
          disabled={!!attachmentName}
        >
          <ThemedText numberOfLines={1}>{attachmentName || inputTitle}</ThemedText>
          <MaterialIcons
            name={attachmentName ? 'highlight-remove' : materialIconName}
            size={20}
            color={theme.iconPrimary}
            onPress={attachmentName ? onClickRemove : undefined}
            {...iconProps}
          />
        </TouchableOpacity>
      </Card>

      {!attachmentName && placeholder && (
        <ThemedText secondary style={{ fontWeight: 'regular' }}>{placeholder}</ThemedText>
      )}

    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  button: {
    padding: 8,
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: "hidden"
  },
  buttonContainer: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  }
})


export default MaterialAttachmentInputButton
