import SummaryDetailScreen from "@/src/screens/Summary/SummaryDetailScreen";
import SummaryListScreen from "@/src/screens/Summary/SummaryListScreen";
import { SummaryStackParamList } from "./types";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SummaryCreationPage from "@/src/screens/Summary/SummaryCreationPage";
import useQueryUpdater from "@/src/api/hooks/useQueryUpdater";
import { Summary } from "@/src/api/types/summary";
import { supabase } from "@/supabase/client";
import { useEffect } from "react";

const Stack = createNativeStackNavigator<SummaryStackParamList>()


export default function SummaryStackNavigator() {


  const {
    insertIntoInfiniteQuery,
    updateDataFromInfiniteQuery,
    removeDataFromInfiniteQuery
  } = useQueryUpdater<Summary>()

  useEffect(() => {
    const channel = supabase
      .channel("summaries:all")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "summaries"
        },
        ({ eventType, new: newSummary, old: oldSummary }) => {
          switch (eventType) {
            case "INSERT":
              insertIntoInfiniteQuery({
                newData: newSummary as Summary,
                queryKey: ["summaries"]
              })
              break

            case "UPDATE":
              updateDataFromInfiniteQuery({
                id: newSummary.id,
                updateFields: newSummary as Summary,
                queryKey: ["summaries"]
              })
              break

            case "DELETE":
              removeDataFromInfiniteQuery({
                queryKey: ["summaries"],
                id: oldSummary.id
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
    <Stack.Navigator screenOptions={{
      headerShown: false,
      animation: "fade"
    }}>
      <Stack.Screen
        name={"SummaryList"}
        component={SummaryListScreen}
      />
      <Stack.Screen
        name={"SummaryCreation"}
        component={SummaryCreationPage}
      />
      <Stack.Screen
        name={"SummaryDetail"}
        component={SummaryDetailScreen}
      />
    </Stack.Navigator>
  )
}
