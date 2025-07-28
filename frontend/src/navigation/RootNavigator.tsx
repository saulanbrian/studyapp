import { useAuth } from "@clerk/clerk-expo";
import { LoadingScreen } from "../components";
import { createNavigationContainerRef, NavigationContainer, NavigationProp, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer"
import SummaryStackNavigator from "./Summary";
import AuthStackNavigator from "./Auth";
import { linking } from "./linking";
import { RootNavigatorParamList } from "./types";
import { SignedInRoute, SignedOutRoute } from "../components/Auth";
import { navigationRef } from "./navigationRef";
import { useUnistyles } from "react-native-unistyles";
import { Dimensions } from "react-native";

export default function RootNavigator() {

  const { isLoaded } = useAuth()

  if (!isLoaded) return <LoadingScreen />

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
    >
      <SignedInRoute>
        <MainDrawerNavigator />
      </SignedInRoute>
      <SignedOutRoute>
        <AuthStackNavigator />
      </SignedOutRoute>
    </NavigationContainer>
  )
}

const Drawer = createDrawerNavigator()

const MainDrawerNavigator = () => {

  const colors = useUnistyles().theme.colors

  return (
    <Drawer.Navigator screenOptions={{
      drawerType: "slide",
      headerStyle: {
        backgroundColor: colors.surface
      },
      headerTintColor: colors.textPrimary,
      drawerStyle: {
        backgroundColor: colors.surface
      },
      drawerActiveTintColor: colors.textPrimary,
      drawerInactiveTintColor: colors.textSecondary,
      drawerActiveBackgroundColor: colors.primary,
      drawerInactiveBackgroundColor: colors.elevated,
      sceneStyle: {
        backgroundColor: colors.background
      },
      swipeEdgeWidth: Dimensions.get('screen').width / 2,
      swipeMinDistance: 30,
    }}>
      <Drawer.Screen
        name={"Summary"}
        component={SummaryStackNavigator}
        options={{
          headerTitle:"Home"
        }}
      />
    </Drawer.Navigator>
  )
}
