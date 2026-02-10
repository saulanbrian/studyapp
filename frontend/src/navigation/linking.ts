import { LinkingOptions } from "@react-navigation/native";
import { RootNavigatorParamList } from "./types";
import * as Linking from 'expo-linking'

export const linking: LinkingOptions<RootNavigatorParamList> = {
  prefixes: [
    Linking.createURL('/'),
    "cutdcrop",
    "https://cutdcrop.com"
  ],
  config: {
    screens: {
      Summary: {
        screens: {
          SummaryList: "",
          SummaryDetail: "summary/:id",
          SummaryCreation: "summarize"
        }
      },
      Auth: {
        path: "auth",
        screens: {
          SSO: "sso"
        }
      },
      Quiz: {
        screens: {
          QuizList: "quiz",
          Quiz: "quiz/:id"
        }
      }
    }
  }
}
