import { Quiz, QuizWithMetadata } from "@/src/api/types/Quiz";
import { useCallback, useMemo } from "react";
import { ThemedText, ThemedView } from "@/src/components"
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import * as Progress from "react-native-progress"
import { View } from "react-native";

export default function QuizCard({
  content,
  score,
  summaryTitle
}: QuizWithMetadata) {


  return (
    <ThemedView surface style={styles.card}>
      <ThemedText numberOfLines={1} style={{ flexShrink: 1 }}>
        {summaryTitle}
      </ThemedText>
      <Score
        numberOfQuestions={content.questions.length}
        score={score}
      />
    </ThemedView>
  )
}


const Score = ({
  numberOfQuestions,
  score
}: { score: number | null; numberOfQuestions: number }) => {

  const { colors } = useUnistyles().theme

  const scorePercentage = useMemo(() => {
    if (!score) return 0
    const percentage = score / numberOfQuestions
    return percentage
  }, [numberOfQuestions, score])

  const getColor = useCallback(() => {
    if (scorePercentage >= 0.9) return colors.success
    if (scorePercentage >= 0.75) return colors.warning
    return colors.error
  }, [scorePercentage])


  return (
    <Progress.Circle
      progress={scorePercentage}
      color={getColor()}
      unfilledColor={colors.elevated}
      thickness={5}
      size={50}
      showsText
      borderWidth={0}
      formatText={() => `${score ?? 0}/${numberOfQuestions}`}
      textStyle={styles.scoreText}
      style={styles.scoreContainer}
    />
  )

}


const styles = StyleSheet.create(theme => ({
  card: {
    borderRadius: theme.radii.xs,
    flexDirection: "row",
    padding: theme.spacing.sm,
    alignItems: "center",
  },
  scoreContainer: {
    marginLeft: 'auto',
  },
  scoreText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textPrimary,
  }
}))
