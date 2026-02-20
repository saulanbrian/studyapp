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
  const questions = useMemo(() => data.content!.questions, [data])
  const [question, setQuestion] = useState(questions[0])
  const [answers, setAnswers] = useState<Choice[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const navigation = useNavigation()

  const { updateDataFromInfiniteQuery } = useQueryUpdater<Quiz>()

  const advanceFn = (answer: Choice) => {
    const updatedAnswers = [...answers, answer]
    const answersLength = updatedAnswers.length
    if (answersLength <= questions.length) {
      setAnswers(updatedAnswers)
      if (answersLength < questions.length) {
        setQuestion(questions[answersLength])
      }
    } else {
      saveResult()
    }
  }

  const saveResult = useCallback(async () => {
    setIsSaving(true)
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
      setIsSaving(false)
      navigation.goBack()
    }
  }, [answers, id])

  useFocusEffect(
    useCallback(() => {
      setQuestion(questions[0])
      setAnswers([])
    }, [])
  )

  if (isSaving) return <ProgressSavingView />

  return (
    <View style={styles.screen}>
      <CountDownView>
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

  return (
    <View style={styles.optionsContainer}>
      {
        question.type === "multiple_choice"
          ? question.choices.map((choice, i) => (
            <OptionButton
              key={i.toString()}
              isCorrect={choice.is_correct}
              optionText={choice.text}
              onPress={() => advanceFn(choice)}
            />
          ))
          : question.choices.map((choice, i) => (
            <OptionButton
              key={i.toString()}
              isCorrect={choice.is_correct}
              optionText={`${choice.value}`}
              onPress={() => advanceFn(choice)}
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
