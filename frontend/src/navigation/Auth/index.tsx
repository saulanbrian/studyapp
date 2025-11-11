import SupabaseAuth from "@/src/components/Auth/SupabaseAuth"
import SSOScreen from "@/src/screens/Auth/SSOScreen"
import { createStackNavigator } from "@react-navigation/stack"

const Stack = createStackNavigator()

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={"auth"} component={SupabaseAuth} />
    </Stack.Navigator>
  )
}
