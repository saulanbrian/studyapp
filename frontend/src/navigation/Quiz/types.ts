import { NavigationProp } from "@react-navigation/native"

export type QuizStackParamList = {
  QuizList: { select?: string };
  QuizPlayScreen: { id: string }
}

export type QuizNavigationProp = NavigationProp<QuizStackParamList>
