import { NavigationProp } from "@react-navigation/native";

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
}

export type AuthStackNavigationProp = NavigationProp<AuthStackParamList>
