import { Quiz } from "@/types/data";
import { ThemedText, ThemedView } from "../ui";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { useThemeContext } from "@/context/Theme";
import { Image } from "expo-image";
import * as Progress from 'react-native-progress'

type QuizPreviewProps = TouchableOpacityProps & {
  quiz: Quiz
}

export default function QuizPreview({
  quiz,
  style,
  ...props
}: QuizPreviewProps) {

  const { theme } = useThemeContext()

  return (
    <TouchableOpacity
      style={
        [
          { backgroundColor: theme.surface },
          styles.container, style,
          style
        ]
      }
      {...props}
    >
      <View style={[styles.containerItem, { flexGrow: 1, flexShrink: 1 }]}>
        <ThemedText
          style={styles.title}
          adjustsFontSizeToFit
          numberOfLines={3}
        >
          {quiz.summary_title}
        </ThemedText>
      </View>
      <ScoreProgress
        highestScore={quiz.highest_score}
        numOfQuestions={quiz.number_of_questions}
      />
    </TouchableOpacity>
  )

}

const ScoreProgress = ({
  highestScore,
  numOfQuestions
}: {
  highestScore: number;
  numOfQuestions: number;
}) => {

  const { theme } = useThemeContext()
  const rawScore = highestScore / numOfQuestions

  return (
    <View style={[styles.containerItem, styles.progressContainer]}>
      <Progress.Circle
        progress={rawScore}
        formatText={() => `${highestScore}/${numOfQuestions}`}
        showsText
        textStyle={{ color: rawScore !== 1 ? theme.textPrimary : theme.secondary }}
        unfilledColor={theme.textPrimary}
        borderWidth={0}
        color={theme.secondary}
        size={60}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    gap: 4
  },
  containerItem: {
    padding: 4,
    justifyContent: 'center'
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  }
})
