import { NavigationProp } from "@react-navigation/native";

export type SummaryStackParamList = {
  SummaryList: undefined;
  SummaryDetail: { id: string };
  SummaryCreation: undefined;
  SummaryPdfView: { summaryId: string }
}

export type SummaryNavigationProp = NavigationProp<SummaryStackParamList>
