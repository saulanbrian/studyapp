import React, { useCallback, useState } from "react";
import { Modal, Pressable, StyleProp, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { Summary } from "@/src/api/types/summary"
import Card from "./Card";
import RetryButton from "./RetryButton";
import OpenButton from "./OpenButton";
import DeleteButton from "./DeleteButton";
import PlayQuizButton from "./PlayQuizButton";
import SummaryContextProvider, { useSummary } from "@/src/context/Summary/SummaryContext";


const INITIAL_ANIMATION_DURATION = 500


export default function SummaryComponent(summary: Summary) {
  return (
    <SummaryContextProvider {...summary}>
      <MainComponent />
    </SummaryContextProvider>
  )
}

function MainComponent() {

  const [isPressed, setIsPressed] = useState(false)
  const { status } = useSummary()

  const handlePress = useCallback(() => {
    if (status !== "pending") setIsPressed(true)
  }, [status])


  const dismiss = useCallback(() => {
    setIsPressed(false)
  }, [isPressed])

  return (
    <Pressable onPress={handlePress}>
      <Card />
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
                <Card />
              </AnimatedModalContent>
              <ActionsContainer
                dismiss={dismiss}
              />
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>
    </Pressable>
  )
}


const ActionsContainer = ({ dismiss }: { dismiss: () => void }) => {

  const { status } = useSummary()

  return (
    <View style={styles.actionsContainer}>
      {status !== "pending" && (
        status === "success"
          ? <OpenButton modalDismissFn={dismiss} />
          : <RetryButton modalDismissFn={dismiss} />
      )}
      <DeleteButton modalDismissFn={dismiss} />
      <PlayQuizButton modalDismissFn={dismiss} />
    </View>
  )
}


const AnimatedModalContent = ({ children }: { children: React.ReactNode }) => {

  const scale = useSharedValue(0)

  const rStyles = useAnimatedStyle(() => ({
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
    <Animated.View style={rStyles} onLayout={() => {
      scale.value = 1
    }}>
      {children}
    </Animated.View>
  )
}


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
}))
