import { ThemedScreen, ThemedText, ThemedView } from "@/src/components";
import { S } from "@/src/constants/Styles";
import { darkColors, lightColors } from "@/src/constants/ui/Colors";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { runOnJS, SharedValue, useAnimatedReaction, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";


type QuizFinishViewProps = {
  score: number;
  numberOfQuestions: number;
}

export default function QuizFinishView({
  score: finalScore,
  numberOfQuestions
}: QuizFinishViewProps) {

  const score = useSharedValue(0)

  useEffect(() => {
    score.value = withTiming(finalScore, { duration: 1500 })
  }, [])

  return (
    <ThemedScreen style={[S.centerContainer, styles.screen]}>
      <DisplayScore score={score} />
      <View style={styles.buttonsContainer}>
        <ViewResultButton />
        <SkipButton />
      </View>
    </ThemedScreen>
  )
}

const DisplayScore = ({
  score
}: { score: SharedValue<number> }) => {

  const [display, setDisplay] = useState(0)

  useAnimatedReaction(
    () => score.value,
    (current) => {
      runOnJS(setDisplay)(Math.round(current))
    }
  )

  return (
    <View>
      <ThemedText style={styles.score}>
        {display}
      </ThemedText>
    </View>
  )

}

const ViewResultButton = () => {

  return (
    <TouchableOpacity style={[
      styles.mainButton,
      styles.viewResultButton
    ]}>
      <ThemedText
        fw={"semiBold"}
        style={styles.viewResultButtonText}
      >
        View Result
      </ThemedText>
    </TouchableOpacity>
  )
}

const SkipButton = () => {

  const navigation = useNavigation()

  const handlePress = useCallback(() => {
    navigation.goBack()
  }, [])

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.mainButton,
        styles.skipButton
      ]}
    >
      <FontAwesome6
        name={"arrow-right-long"}
        color={lightColors.textSecondary}
        size={20}
      />
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create(theme => ({
  buttonsContainer: {
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.xs
  },
  mainButton: {
    borderRadius: theme.radii.pill,
    padding: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center"
  },
  screen: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: theme.spacing.md
  },
  skipButton: {
    backgroundColor: darkColors.textPrimary,
  },
  score: {
    fontSize: 120,
    fontWeight: "800"
  },
  viewResultButton: {
    borderColor: darkColors.textPrimary,
    borderWidth: 2,
  },
  viewResultButtonText: {
    color: darkColors.textPrimary,
    fontSize: theme.fontSize.sm,
    letterSpacing: 1.5
  }
}))
