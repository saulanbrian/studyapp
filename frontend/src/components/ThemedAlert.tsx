import { ActivityIndicator, Dimensions, Modal, ModalProps, TouchableOpacity, View } from "react-native";
import { S } from "../constants/Styles";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import ThemedButton from "./ThemedButton";
import { darkColors } from "../constants/ui/Colors";


type AlertAction = {
  title: string;
  onDispatch: () => void
}

type Actions = {
  primaryAction: AlertAction & {
    warning?: boolean;
    isPending?: boolean;
  };
  secondaryAction?: AlertAction
}

type ThemedAlertProps = Omit<ModalProps, 'children'> & {
  title?: string;
  text: string;
} & Actions

export default function ThemedAlert({
  title,
  text,
  primaryAction,
  secondaryAction,
  ...props
}: ThemedAlertProps) {

  return (
    <Modal
      transparent
      navigationBarTranslucent
      statusBarTranslucent
      animationType={"fade"}
      {...props}
    >
      <View style={[S.centerContainer, styles.container]}>
        <ThemedView style={styles.card} elevated>
          <TextsContainer
            text={text}
            title={title}
          />
          <ActionsContainer
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
          />
        </ThemedView>
      </View>
    </Modal>
  )
}


const TextsContainer = ({
  text,
  title
}: {
  title?: string;
  text: string
}) => {
  return (
    <View style={styles.textsContainer}>
      {title && (
        <ThemedText fw={"semiBold"} >
          {title}
        </ThemedText>
      )}
      <ThemedText
        color={"disabled"}
        size={"sm"}
      >
        {text}
      </ThemedText>
    </View>
  )
}

const ActionsContainer = ({
  primaryAction,
  secondaryAction
}: Actions) => {

  styles.useVariants({ isPending: primaryAction.isPending })

  return (
    <View style={styles.actionsContainer}>
      <ThemedButton
        style={styles.primaryActionBtn}
        title={primaryAction.title}
        color={primaryAction.warning ? "error" : "primary"}
        onPress={primaryAction.onDispatch}
        {...(primaryAction.isPending && { disabled: primaryAction.isPending })}
      >
        {primaryAction.isPending ? (
          <ActivityIndicator color={darkColors.textPrimary} />
        ) : (
          <ThemedText style={styles.primaryActionBtnText}>
            {primaryAction.title}
          </ThemedText>
        )}
      </ThemedButton>
      {secondaryAction && (
        <TouchableOpacity onPress={secondaryAction.onDispatch}>
          <ThemedText>{secondaryAction.title}</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  actionsContainer: {
    flexDirection: "row-reverse",
    gap: theme.spacing.sm,
    alignItems: "center",
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    width: Dimensions.get("screen").width * 0.8,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.md,
    gap: theme.spacing.lg
  },
  primaryActionBtn: {
    borderRadius: theme.radii.pill,
    variants: {
      isPending: {
        true: {
          opacity: 0.7
        }
      }
    }
  },
  primaryActionBtnText: {
    color: darkColors.textPrimary
  },
  text: {
  },
  textsContainer: {
    gap: theme.spacing.xs
  }
}))
