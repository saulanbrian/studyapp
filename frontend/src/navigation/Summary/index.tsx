import SummaryDetailScreen from "@/src/screens/Summary/SummaryDetailScreen";
import SummaryListScreen from "@/src/screens/Summary/SummaryListScreen";
import { SummaryStackParamList } from "./types";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SummaryCreationPage from "@/src/screens/Summary/SummaryCreationPage";

const Stack = createNativeStackNavigator<SummaryStackParamList>()


export default function SummaryStackNavigator() {

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      animation: "fade"
    }}>
      <Stack.Screen
        name={"SummaryList"}
        component={SummaryListScreen}
      />
    </Stack.Navigator>
  )
}
