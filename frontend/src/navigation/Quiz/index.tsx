import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QuizStackParamList } from "./types";
import QuizListScreen from "@/src/screens/Quiz/QuizListScreen";

const Stack = createNativeStackNavigator<QuizStackParamList>()

export default function QuizStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        name={"QuizList"}
        component={QuizListScreen}
      />
    </Stack.Navigator>
  )
}
