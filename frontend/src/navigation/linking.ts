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
          SummaryCreation: "summarize",
          SummaryPdfView: "summary/pdf-prefview/:id"
        }
      },
      Auth: {
        path: "auth",
        screens: {
          SignIn: "signin",
          SignUp: "signup"
        }
      },
      Quiz: {
        screens: {
          QuizList: "quiz",
          QuizPlayScreen: "quiz/:id",
          QuizResult: "quiz/result/:id"
        }
      }
    }
  }
}
