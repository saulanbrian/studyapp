import { useAuth } from "@clerk/clerk-expo";
import { LoadingScreen, ThemedView } from "../components";
import { createNavigationContainerRef, getFocusedRouteNameFromRoute, NavigationContainer, NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer"
import SummaryStackNavigator from "./Summary";
import AuthStackNavigator from "./Auth";
import { linking } from "./linking";
import { RootNavigatorParamList } from "./types";
import { SignedInRoute, SignedOutRoute } from "../components/Auth";
import { navigationRef } from "./navigationRef";
import { useUnistyles } from "react-native-unistyles";
import { Dimensions } from "react-native";
import { CustomDrawerContent } from "../components/Drawer";
import { FontAwesome } from "@expo/vector-icons"
import { useCallback, useEffect, useState } from "react";
import { SplashScreen } from "expo-router";
import * as Fonts from "expo-font"
import SystemNavigationBar from "react-native-system-navigation-bar"
import { useAppNavigation } from "../hooks/useAppNavigation";
import ErrorBoundary from "react-native-error-boundary"
import { QueryErrorResetBoundary } from "@tanstack/react-query"
import { ENV } from "../constants/Env";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/supabase/client"
import QuizStackNavigator from "./Quiz";

async function loadFonts() {
  try {
    await Fonts.loadAsync(FontAwesome.font)
  } catch (e) {
    return
  }
}

export default function RootNavigator() {

  const [session, setSession] = useState<Session | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  useEffect(() => {
    (async () => {

      loadFonts()

      const { data, error } = await supabase.auth.getSession()
      if (data) {
        setSession(data.session)
      } else {
        setSession(null)
      }

      setIsLoadingSession(false)

      supabase.auth.onAuthStateChange((_, session) => {
        setSession(session)
      })


    })()
  }, [])

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
    >
      <QueryErrorResetBoundary >
        {({ reset }) =>
          session
            ? <MainDrawerNavigator />
            : isLoadingSession
              ? <LoadingScreen />
              : <AuthStackNavigator />
        }
      </QueryErrorResetBoundary>
    </NavigationContainer>
  )
}

const Drawer = createDrawerNavigator<Omit<RootNavigatorParamList, "Auth">>()

const MainDrawerNavigator = () => {

  const colors = useUnistyles().theme.colors

  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerType: "slide",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.surface
        },
        headerTintColor: colors.textPrimary,
        drawerStyle: {
          backgroundColor: colors.surface
        },
        drawerActiveTintColor: colors.buttonText,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: colors.primary,
        drawerInactiveBackgroundColor: colors.elevated,
        drawerItemStyle: {
          marginBottom: 4
        },
        drawerIcon: ({ color, focused, size }) => {
          let icon = null


          switch (route.name) {
            case "Summary":
              icon = focused ? "folder" : "folder-o"
              break
            case "Quiz":
              icon = focused ? "play-circle" : "play-circle-o"
              break
          }


          return <FontAwesome
            name={icon as any}
            size={size}
            color={color}
          />
        },
        sceneStyle: {
          backgroundColor: colors.background
        },
        swipeEdgeWidth: Dimensions.get('screen').width / 2,
        swipeMinDistance: 20,
      })}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name={"Summary"}
        component={SummaryStackNavigator}
        options={{
          headerTitle: "Home"
        }}
      />
      <Drawer.Screen
        name={"Quiz"}
        component={QuizStackNavigator}
        options={({ route }) => {

          const routeName = getFocusedRouteNameFromRoute(route)

          return {
            headerTitle: "Quiz",
            headerShown: routeName !== "QuizPlayScreen"
          }
        }}
      />
    </Drawer.Navigator>
  )
}
