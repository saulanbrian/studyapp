import SummaryDetailScreen from "@/src/screens/Summary/SummaryDetailScreen";
import SummaryListScreen from "@/src/screens/Summary/SummaryListScreen";
import { SummaryStackParamList } from "./types";
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const Stack = createNativeStackNavigator<SummaryStackParamList>()


export default function SummaryStackNavigator() {

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen
        name={"SummaryList"}
        component={SummaryListScreen}
      />
      <Stack.Screen
        name={"SummaryDetail"}
        component={SummaryDetailScreen}
      />
    </Stack.Navigator>
  )
}
