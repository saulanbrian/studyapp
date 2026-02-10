import { NavigationProp } from "@react-navigation/native"

export type QuizStackParamList = {
  QuizList: undefined;
  QuizPlayScreen: { id: string }
}

export type QuizNavigationProp = NavigationProp<QuizStackParamList>
