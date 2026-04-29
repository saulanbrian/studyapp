import { QuestionType, TrueOrFalseOption } from "@/src/api/types/Quiz";
import { LoadingScreen, ThemedScreen, ThemedText, ThemedView } from "@/src/components";
import OptionButton from "@/src/components/Quiz/OptionButton";
import { S } from "@/src/constants/Styles";
import { darkColors } from "@/src/constants/ui/Colors";
import { QuizStackParamList } from "@/src/navigation/Quiz/types";
import { QuizResult, QuizResultQuestion, useQuizResult } from "@/src/stores/quiz";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";


type QuizResultRouteProp = RouteProp<QuizStackParamList, 'QuizResult'>

export default function QuizResultScreen() {

  const { params: { id } } = useRoute<QuizResultRouteProp>()

  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<QuizResult>()
  const { results } = useQuizResult()

  useEffect(() => {
    const res = results.find(r => r.quizId === id)
    setResult(res)
    setIsLoading(false)
  }, [id])

  if (isLoading) return <LoadingScreen />

  return (
    <ThemedScreen style={styles.screen}>
      {
        !result
          ? <NotFound />
          : <Result result={result} />
      }
    </ThemedScreen>
  )
}

const Result = ({ result }: { result: QuizResult }) => {

  const renderChoices = useCallback((question: QuizResultQuestion) => {
    if (question.type === QuestionType.TrueOrFalse) {
      return question.choices.map((choice, i) => (
        <Option
          key={`${question.question}_${choice.value}`}
          optionText={`${choice.value}`}
          isCorrect={choice.is_correct}
          selected={question.selectedAnswer === choice.value}
        />
      ))
    } else {
      return question.choices.map((choice, i) => (
        <Option
          key={`${question.question}_${choice.text}`}
          optionText={choice.text}
          isCorrect={choice.is_correct}
          selected={question.selectedAnswer === choice.text}
        />
      ))
    }
  }, [])

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {result.questions.map((question, i) => (
        <>
          <ThemedText
            style={[styles.text, styles.questionText]}
            key={i.toString()}
          >
            {question.question}
          </ThemedText>
          <View style={[
            styles.optionsContainer,
            {
              ...(
                question.type === QuestionType.TrueOrFalse
                  ? { flexDirection: "row" }
                  : {}
              )
            }
          ]}>
            {renderChoices(question)}
          </View>
        </>
      ))}
    </ScrollView>
  )

}

const NotFound = () => {

  return (
    <View style={S.centerContainer}>
      <ThemedText
        size={"xl"}
        fw={"semiBold"}
        style={styles.text}
      >
        Not Found!
      </ThemedText>
      <ThemedText
        color={"secondary"}
        style={styles.textSecondary}
      >
        couldn't find a result
      </ThemedText>
    </View>
  )
}

type OptionProps = {
  optionText: string;
  isCorrect: boolean;
  selected: boolean;
}

const Option = ({
  selected,
  isCorrect,
  optionText
}: OptionProps) => {

  styles.useVariants({ selected })

  return (
    <OptionButton
      optionText={optionText}
      style={
        isCorrect
          ? styles.correctOption
          : selected
            ? styles.selectedWrong
            : {}
      }
    />
  )
}

const styles = StyleSheet.create(theme => ({
  correctOption: {
    backgroundColor: theme.colors.success,
    variants: {
      selected: {
        false: {
          opacity: 0.6
        }
      }
    }
  },
  option: {
  },
  optionsContainer: {
    gap: theme.spacing.xxs
  },
  questionText: {
    fontSize: 20,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg * 3
  },
  selectedWrong: {
    backgroundColor: theme.colors.error
  },
  screen: {
  },
  text: {
    color: theme.colors.textPrimary
  },
  textSecondary: {
    color: theme.colors.textSecondary
  }
}))
