import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QuizStackParamList } from "./types";
import QuizListScreen from "@/src/screens/Quiz/QuizListScreen";
import useQueryUpdater from "@/src/api/hooks/useQueryUpdater";
import { Quiz } from "@/src/api/types/Quiz";
import { supabase } from "@/supabase/client";
import { useEffect } from "react";
import QuizPlayScreen from "@/src/screens/Quiz/QuizPlayScreen";
import QuizSoundContextProvider from "@/src/context/Quiz/QuizSoundProvider";
import QuizResultScreen from "@/src/screens/Quiz/QuizResultScreen";

const Stack = createNativeStackNavigator<QuizStackParamList>()

export default function QuizStackNavigator() {

  const {
    insertIntoInfiniteQuery,
    updateDataFromInfiniteQuery,
    removeDataFromInfiniteQuery
  } = useQueryUpdater<Quiz>()

  useEffect(() => {
    const channel = supabase
      .channel("quizzes:all")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "summaries"
        },
        ({ eventType, new: newQuiz, old: oldQuiz }) => {
          switch (eventType) {

            case "UPDATE":
              updateDataFromInfiniteQuery({
                id: newQuiz.id,
                updateFields: newQuiz as Quiz,
                queryKey: ["quizzes"]
              })
              break

            case "DELETE":
              removeDataFromInfiniteQuery({
                queryKey: ["quizzes"],
                id: oldQuiz.id
              })
              break
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <QuizSoundContextProvider>
      <Stack.Navigator screenOptions={{
        headerShown: false,
        animation: "ios_from_right"
      }}>
        <Stack.Screen
          name={"QuizList"}
          component={QuizListScreen}
        />
        <Stack.Screen
          name={"QuizPlayScreen"}
          component={QuizPlayScreen}
        />
        <Stack.Screen
          name={"QuizResult"}
          component={QuizResultScreen}
        />
      </Stack.Navigator>
    </QuizSoundContextProvider>
  )
}
