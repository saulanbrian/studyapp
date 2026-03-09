import { NavigationProp } from "@react-navigation/native"

export type QuizStackParamList = {
  QuizList: { select?: string };
  QuizPlayScreen: { id: string };
  QuizResult: { id: string };
}

export type QuizNavigationProp = NavigationProp<QuizStackParamList>
