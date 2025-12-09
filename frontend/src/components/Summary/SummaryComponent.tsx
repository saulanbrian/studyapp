import { SummaryNavigationProp, SummaryStackParamList } from "@/src/navigation/Summary/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { Modal, Pressable, PressableProps, StyleProp, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import ThemedView from "../ThemedView";
import { S } from "@/src/constants/Styles";
import ThemedText from "../ThemedText";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { Summary } from "@/src/api/types/summary";
import { Ionicons } from "@expo/vector-icons";
import { darkColors } from "@/src/constants/ui/Colors";
import SummaryComponentCard from "./SummaryComponentCard";
import ThemedAlert from "../ThemedAlert";
import deleteSummary from "@/src/api/services/summaries/deleteSummary";
import { requestSummary } from "@/src/api/services/summaries";
import updateSummary from "@/src/api/services/summaries/updateSummary";



const INITIAL_ANIMATION_DURATION = 500


const SummaryComponent = React.memo((summary: Summary) => {

  const [isPressed, setIsPressed] = useState(false)

  const handlePress = useCallback(() => {
    if (summary.status !== "pending") setIsPressed(true)
  }, [summary])


  const dismiss = useCallback(() => {
    setIsPressed(false)
  }, [isPressed])

  return (
    <Pressable onPress={handlePress}>
      <SummaryComponentCard {...summary} />
      <Modal
        transparent
        statusBarTranslucent
        navigationBarTranslucent
        visible={isPressed}
        animationType={"fade"}
      >
        <Pressable
          onPress={() => setIsPressed(false)}
          style={[styles.modalBackdrop]}
        >
          <TouchableWithoutFeedback>
            <View>
              <AnimatedModalContent>
                <SummaryComponentCard {...summary} />
              </AnimatedModalContent>
              <ActionsContainer
                status={summary.status}
                id={summary.id}
                dismiss={dismiss}
              />
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>
    </Pressable>
  )

})


const ActionsContainer = ({
  id,
  dismiss,
  status
}: Pick<Summary, 'status' | 'id'> & {
  dismiss: () => void
}) => {

  const { colors } = useUnistyles().theme
  const [alertVisible, setAlertVisible] = useState(false)

  const handleDeletePress = useCallback(() => {
    setAlertVisible(true)
  }, [id])

  const handleDelete = useCallback(() => {
    deleteSummary(id)
    setAlertVisible(false)
    dismiss()
  }, [id])

  return (
    <View style={styles.actionsContainer}>
      {status !== "pending" && (
        status === "success"
          ? <OpenButton id={id} />
          : <RetryButton id={id} dismiss={dismiss} />
      )}
      <ModalActionButton
        onPress={handleDeletePress}
      >
        <Ionicons
          name={"trash-bin"}
          size={24}
          color={colors.error}
        />
        <ThemedText
          size={"xxs"}
          color={"error"}
        >
          delete
        </ThemedText>
      </ModalActionButton>
      <ModalActionButton style={styles.quizButton}>
        <Ionicons
          name={"play"}
          size={24}
          color={darkColors.textPrimary}
        />
        <ThemedText style={styles.quizButtonText}>
          Play Quiz
        </ThemedText>
      </ModalActionButton>
      <ThemedAlert
        visible={alertVisible}
        title={"summary deletion confirmation"}
        text="are you sure you want to delete this summary?"
        primaryAction={{
          title: "delete",
          onDispatch: handleDelete,
          warning: true
        }}
        secondaryAction={{
          title: "cancel",
          onDispatch: () => {
            setAlertVisible(false)
          }
        }}
      />
    </View>
  )
}


const RetryButton = ({
  id,
  dismiss
}: {
  id: string,
  dismiss: () => void
}) => {

  const { colors } = useUnistyles().theme

  const handleRetry = useCallback(() => {
    updateSummary({
      id,
      fields: {
        status: "pending"
      }
    })
    requestSummary(id)
    dismiss()
  }, [id])

  return (
    <ModalActionButton onPress={handleRetry}>
      <Ionicons
        name={"reload"}
        size={24}
        color={colors.warning}
      />
      <ThemedText
        color={"warning"}
        size={"xxs"}
      >
        retry
      </ThemedText>
    </ModalActionButton>
  )
}


const OpenButton = ({ id }: { id: string }) => {

  const { colors } = useUnistyles().theme
  const navigation = useNavigation<SummaryNavigationProp>()

  const handleOpen = useCallback(() => {
    navigation.navigate("SummaryDetail", { id })
  }, [id])

  return (
    <ModalActionButton onPress={handleOpen}>
      <Ionicons
        name={"open-outline"}
        color={colors.primary}
        size={24}
      />
      <ThemedText
        color={"themePrimary"}
        size={"xxs"}
      >
        open
      </ThemedText>
    </ModalActionButton>
  )
}


const ModalActionButton = ({
  style,
  onPress,
  children,
}: PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  onPress?: () => void
}>) => {

  const scale = useSharedValue(0)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  const rStyles = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(scale.value)
      }
    ]
  }))

  const handleLayout = useCallback(() => {
    timeout.current = setTimeout(() => {
      scale.value = 1
    }, INITIAL_ANIMATION_DURATION)
  }, [])

  useEffect(() => {

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }

  }, [])

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => scale.value = 0.93}
      onPressOut={() => scale.value = 1}
      onLayout={() => handleLayout()}
      style={[styles.actionButton, rStyles, style]}
    >
      {children}
    </AnimatedPressable>
  )
}


const AnimatedModalContent = ({ children }: { children: React.ReactNode }) => {

  const scale = useSharedValue(0)

  const styles = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(scale.value, {
          stiffness: 120,
          duration: INITIAL_ANIMATION_DURATION
        })
      }
    ]
  }))

  return (
    <Animated.View style={styles} onLayout={() => {
      scale.value = 1
    }}>
      {children}
    </Animated.View>
  )
}


const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default SummaryComponent

const styles = StyleSheet.create(theme => ({
  actionButton: {
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radii.xs,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    width: 60
  },
  actionsContainer: {
    flexDirection: "row",
    alignContent: "center",
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center'
  },
  quizButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1
  },
  quizButtonText: {
    color: darkColors.textPrimary
  }
}))
