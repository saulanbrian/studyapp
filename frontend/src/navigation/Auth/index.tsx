import SupabaseAuth from "@/src/components/Auth/SupabaseAuth"
import { createStackNavigator } from "@react-navigation/stack"
import { AuthStackParamList } from "./types"
import SignInScreen from "@/src/screens/Auth/SignInScreen"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { darkColors } from "@/src/constants/ui/Colors"
import { AppHeader } from "@/src/components"
import SignUpScreen from "@/src/screens/Auth/SignUpScreen"

const Stack = createStackNavigator<AuthStackParamList>()

export default function AuthStackNavigator() {

  const { colors } = useUnistyles().theme

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: darkColors.textPrimary,
        headerStyle: {
          backgroundColor: colors.primaryDark
        }
      }}
    >
      <Stack.Screen
        options={{
          header: props => <AppHeader {...props} />
        }}
        name={"SignIn"}
        component={SignInScreen}
      />
      <Stack.Screen
        name={"SignUp"}
        component={SignUpScreen}
        options={{
          headerTitle: "Signup"
        }}
      />
    </Stack.Navigator>
  )
}

