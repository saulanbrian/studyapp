import { SummaryNavigationProp } from "@/src/navigation/Summary/types";
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


const INITIAL_ANIMATION_DURATION = 500

type PressContainerProps = PropsWithChildren<Pick<Summary, 'id' | 'status'>>

export default function PressContainer({
  id,
  status,
  children
}: PressContainerProps) {

  const [isPressed, setIsPressed] = useState(false)

  const handlePress = useCallback(() => {
    if (status !== "pending") setIsPressed(true)
  }, [id, status])


  return (
    <Pressable onPress={handlePress}>
      {children}
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
                {children}
              </AnimatedModalContent>
              <ActionsContainer status={status} />
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>
    </Pressable>
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



const ActionsContainer = ({
  status
}: Pick<Summary, 'status'>) => {

  const { colors } = useUnistyles().theme

  return (
    <View style={styles.actionsContainer}>
      <ModalActionButton>
        <Ionicons
          name={status === "error" ? "reload" : "open-outline"}
          color={status === "error" ? colors.warning : colors.primary}
          size={24}
        />
        <ThemedText
          size={"xxs"}
          color={status === "error" ? "warning" : "themePrimary"}
        >
          {status === "error" ? "retry" : "open"}
        </ThemedText>
      </ModalActionButton>
      <ModalActionButton>
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
    </View>
  )
}


const ModalActionButton = ({
  style,
  children,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) => {

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
      onPressIn={() => scale.value = 0.93}
      onPressOut={() => scale.value = 1}
      onLayout={() => handleLayout()}
      style={[styles.actionButton, rStyles, style]}
    >
      {children}
    </AnimatedPressable>
  )
}


const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

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
