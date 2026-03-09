import { useGetQuiz } from "@/src/api/queries/quizzes";
import { MultipleChoiceOption, Question, QuestionType, Quiz, TrueOrFalseOption } from "@/src/api/types/Quiz";
import { LoadingScreen, ThemedScreen, ThemedText, ThemedView } from "@/src/components";
import OptionButton from "@/src/components/Quiz/OptionButton";
import { darkColors } from "@/src/constants/ui/Colors";
import { useDrawer } from "@/src/context/DrawerContext";
import { QuizStackParamList } from "@/src/navigation/Quiz/types";
import { NavigationProp, RouteProp, StackActions, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import CountDownView from "@/src/screens/Quiz/components/CountdownView";
import ExitConfirmationModal from "@/src/components/Quiz/ExitConfirmationModal";
import { useQuizSound } from "@/src/context/Quiz/QuizSoundProvider";
import QuizFinishView from "./components/QuizFinishView";
import { QuizResult, QuizResultQuestion, useQuizResult } from "@/src/stores/quiz";
import checkFileSize from "@/src/utils/FileSystem/getFileSize";


type QuizPlayScreenRouteProp = RouteProp<QuizStackParamList, 'QuizPlayScreen'>

export default function QuizPlayScreen() {

  const { setOptions } = useDrawer()
  const { params: { id } } = useRoute<QuizPlayScreenRouteProp>()

  useEffect(() => {

    setOptions({
      swipeEnabled: false
    })
    StatusBar.setHidden(true)

    return () => {
      setOptions({
        swipeEnabled: true
      })
    }
  }, [])

  return (
    <Suspense fallback={LoadingScreen()}>
      <Content id={id} />
    </Suspense>
  )
}

type Choice = MultipleChoiceOption | TrueOrFalseOption

const Content = ({ id }: { id: string; }) => {

  const { data } = useGetQuiz(id)
  const { quizBackgroundMusic } = useQuizSound()
  const questions = useMemo(() => data.content!.questions, [data])
  const [question, setQuestion] = useState(questions[0])
  const [finishedQuestions, setFinishedQuestions] = useState<QuizResultQuestion[]>([])
  const [isFinished, setIsFinished] = useState(false)

  const { saveResult } = useQuizResult()

  const advanceFn = (answer: Choice) => {
    if (finishedQuestions.length < questions.length) {
      const updatedFinishedQuestions: QuizResultQuestion[] = [
        ...finishedQuestions,
        {
          ...question,
          selectedAnswer: question.type === QuestionType.MultipleChoice
            ? (answer as MultipleChoiceOption).text
            : (answer as TrueOrFalseOption).value
        }
      ]
      setFinishedQuestions(updatedFinishedQuestions)
      if (updatedFinishedQuestions.length < questions.length) {
        setQuestion(questions[updatedFinishedQuestions.length])
      }
    }
  }

  const onCountdownEnd = useCallback(() => {
    quizBackgroundMusic.play()
  }, [quizBackgroundMusic])

  useFocusEffect(
    useCallback(() => {
      setQuestion(questions[0])
      setFinishedQuestions([])
      return () => quizBackgroundMusic.stop()
    }, [])
  )

  useEffect(() => {
    if (finishedQuestions.length === questions.length) {
      setIsFinished(true)
      saveResult({
        quizId: id,
        questions: finishedQuestions
      })
    }
  }, [finishedQuestions, questions])

  if (isFinished) {

    let score = 0

    finishedQuestions.forEach(question => {
      question.choices.forEach(choice => {
        if (question.type === QuestionType.MultipleChoice) {
          if (question.selectedAnswer === (choice as MultipleChoiceOption).text) {
            if (choice.is_correct) {
              score++
            }
          }
        } else {
          if (question.selectedAnswer === (choice as TrueOrFalseOption).value) {
            if (choice.is_correct) {
              score++
            }
          }
        }
      })
    })

    return (
      <QuizFinishView
        score={score}
        numberOfQuestions={questions.length}
        id={id}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <CountDownView onCountdownEnd={onCountdownEnd}>
        <TitleHeader summaryTitle={data.summaryTitle} />
        <QuestionContainer question={question.question} />
        <OptionsContainer
          question={question}
          advanceFn={advanceFn}
        />
      </CountDownView>
      <ExitConfirmationModal />
    </View>
  )
}

const TitleHeader = ({ summaryTitle }: { summaryTitle: string }) => {

  const { top } = useSafeAreaInsets()

  return (
    <ThemedView style={[styles.titleContainer, { paddingTop: top * 1.5 }]}>
      <ThemedText
        style={styles.title}
        size={"lg"}
        adjustsFontSizeToFit
        numberOfLines={3}
      >
        {summaryTitle}
      </ThemedText>
    </ThemedView>
  )
}

const QuestionContainer = ({ question }: { question: string }) => {

  return (
    <View style={styles.questionContainer}>
      <ThemedText size={"xl"} style={styles.question}>
        {question}
      </ThemedText>
    </View>
  )
}


type OptionsProps = {
  question: Question;
  advanceFn: (choice: MultipleChoiceOption | TrueOrFalseOption) => void;
}

const OptionsContainer = ({ advanceFn, question }: OptionsProps) => {

  styles.useVariants({ trueOrFalse: question.type === "true_or_false" })
  const { quizAnswerClickSound } = useQuizSound()

  const handleSelect = useCallback((choice: Choice) => {
    quizAnswerClickSound.play()
    advanceFn(choice)
  }, [advanceFn])

  return (
    <View style={styles.optionsContainer}>
      {
        question.type === "multiple_choice"
          ? question.choices.map((choice, i) => (
            <OptionButton
              key={i.toString()}
              optionText={choice.text}
              onPress={() => handleSelect(choice)}
              style={styles.optionButton}
            />
          ))
          : question.choices.map((choice, i) => (
            <OptionButton
              key={i.toString()}
              optionText={`${choice.value}`}
              onPress={() => handleSelect(choice)}
              style={styles.optionButton}
            />
          ))
      }
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  optionButton: {
    padding: theme.spacing.lg,
    variants: {
      trueOrFalse: {
        true: {
          flexGrow: 1,
          aspectRatio: 1
        },
        false: {
          paddingHorizontal: theme.spacing.md,
          alignItems: 'flex-start',
        }
      }
    }
  },
  optionsContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    variants: {
      trueOrFalse: {
        true: {
          flexDirection: "row",
        }
      }
    }
  },
  question: {
    alignSelf: "center",
    color: darkColors.textPrimary,
  },
  questionContainer: {
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    height: 360,
  },
  screen: {
    backgroundColor: theme.colors.primaryLight,
    flex: 1
  },
  title: {
    color: darkColors.textPrimary,
    alignSelf: "center",
  },
  titleContainer: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md
  }
}))
