import { ThemedScreen, ThemedText } from "@/src/components";
import { QuizStackParamList } from "@/src/navigation/Quiz/types";
import { NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";


type QuizPlayScreenRouteProp = RouteProp<QuizStackParamList, 'QuizPlayScreen'>

export default function QuizPlayScreen() {

  const { params: { id } } = useRoute<QuizPlayScreenRouteProp>()
  const { top } = useSafeAreaInsets()

  return (
    <ThemedScreen style={{ paddingTop: top }}>
      <ThemedText>quiz: {id}</ThemedText>
    </ThemedScreen>
  )
}
