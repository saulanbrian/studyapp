import { NavigationProp } from "@react-navigation/native";

export type SummaryStackParamList = {
  SummaryList: undefined;
  SummaryDetail: { id: string }
}

export type SummaryNavigationProp = NavigationProp<SummaryStackParamList>
