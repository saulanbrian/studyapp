import { NavigationProp } from "@react-navigation/native";

export type SummaryStackParamList = {
  SummaryList: undefined;
  SummaryDetail: { id: string };
  SummaryCreation: undefined;
}

export type SummaryNavigationProp = NavigationProp<SummaryStackParamList>
