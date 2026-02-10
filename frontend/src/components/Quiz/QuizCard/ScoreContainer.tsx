import * as Progress from "react-native-progress"
import { Quiz } from "@/src/api/types/Quiz";
import { useCallback, useMemo } from "react";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ViewProps } from "react-native";
import { useQuiz } from "@/src/context/Quiz/QuizContext";


export const ScoreContainer = (
  { style }: { style?: ViewProps["style"] }
) => {

  const { colors } = useUnistyles().theme;
  const { score, content } = useQuiz()
  const numberOfQuestions = content!.questions.length

  const scorePercentage = useMemo(() => {
    const percentage = score ?? 0 / numberOfQuestions;
    return percentage;
  }, [numberOfQuestions, score]);

  const getColor = useCallback(() => {
    if (scorePercentage >= 0.9) return colors.success;
    if (scorePercentage >= 0.75) return colors.warning;
    return colors.error;
  }, [scorePercentage]);

  const displayText = useCallback(() => {
    return `${score}/${numberOfQuestions}`;
  }, [score, numberOfQuestions]);

  return (
    <Progress.Circle
      progress={scorePercentage}
      color={getColor()}
      unfilledColor={colors.textSecondary}
      thickness={5}
      size={50}
      showsText
      borderWidth={0}
      formatText={displayText}
      textStyle={styles.scoreText}
      style={style}
    />
  );
};

const styles = StyleSheet.create(theme => ({
  scoreText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textPrimary,
  },
}))
