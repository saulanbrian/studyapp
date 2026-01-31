import { NavigatorScreenParams } from "@react-navigation/native"
import { SummaryStackParamList } from "./Summary/types"
import { AuthStackParamList } from "./Auth/types";
import { QuizStackParamList } from "./Quiz/types";

export type RootNavigatorParamList = {
  Summary: NavigatorScreenParams<SummaryStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Quiz: NavigatorScreenParams<QuizStackParamList>
}
