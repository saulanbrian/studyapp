import { useGetQuiz } from "@/src/api/queries/quizzes";
import { MultipleChoiceOption, Question, Quiz, TrueOrFalseOption } from "@/src/api/types/Quiz";
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
import CountDownView from "@/src/components/Quiz/CountdownView";
import ExitConfirmationModal from "@/src/components/Quiz/ExitConfirmationModal";
import updateQuiz from "@/src/api/services/quizzes/updateQuiz";
import useQueryUpdater from "@/src/api/hooks/useQueryUpdater";
import ProgressSavingView from "@/src/components/Quiz/ProgressSavingView";
import { useQuizSound } from "@/src/context/Quiz/QuizSoundProvider";
import Toast from "react-native-toast-message";
import QuizFinishView from "./components/QuizFinishView";


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
  const [answers, setAnswers] = useState<Choice[]>([])
  const [isFinished, setIsFinished] = useState(false)

  const { updateDataFromInfiniteQuery } = useQueryUpdater<Quiz>()

  const advanceFn = (answer: Choice) => {

    if (answers.length === questions.length) return

    const updatedAnswers = [...answers, answer]
    setAnswers(updatedAnswers)
    if (updatedAnswers.length < questions.length) {
      setQuestion(questions[updatedAnswers.length])
    }
  }

  const saveResult = useCallback(async () => {
    Toast.show({
      type: "neutral",
      autoHide: true,
      text2: "saving score...",
      visibilityTime: 2000
    })
    const correctAnswers = answers.filter(a => a.is_correct).length
    const { data, error } = await updateQuiz({ id, updateFields: { score: correctAnswers } })
    if (!error && data) {
      updateDataFromInfiniteQuery({
        id,
        queryKey: ["quizzes"],
        updateFields: {
          score: correctAnswers
        }
      })
    }
    Toast.show({
      type: "success",
      autoHide: true,
      text2: "score saved!",
      visibilityTime: 2000,
    })
  }, [answers, id])

  const onCountdownEnd = useCallback(() => {
    quizBackgroundMusic.play()
  }, [quizBackgroundMusic])

  useFocusEffect(
    useCallback(() => {
      setQuestion(questions[0])
      setAnswers([])
      return () => quizBackgroundMusic.stop()
    }, [])
  )

  useEffect(() => {
    if (answers.length === questions.length) {
      setIsFinished(true)
      saveResult()
    }
  }, [answers, questions])

  if (isFinished) return (
    <QuizFinishView
      score={answers.filter(a => a.is_correct).length}
      numberOfQuestions={questions.length}
    />
  )

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
              isCorrect={choice.is_correct}
              optionText={choice.text}
              onPress={() => handleSelect(choice)}
            />
          ))
          : question.choices.map((choice, i) => (
            <OptionButton
              key={i.toString()}
              isCorrect={choice.is_correct}
              optionText={`${choice.value}`}
              onPress={() => handleSelect(choice)}
            />
          ))
      }
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  optionsContainer: {
    padding: theme.spacing.md,
    variants: {
      trueOrFalse: {
        true: {
          flexDirection: "row",
        }
      }
    }
  },
  question: {
    alignSelf: "center"
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
