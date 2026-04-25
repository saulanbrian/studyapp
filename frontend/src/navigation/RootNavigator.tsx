import { LoadingScreen, ThemedView, AppHeader, AppLogo, ThemedText } from "../components";
import { getFocusedRouteNameFromRoute, NavigationContainer, NavigationProp, NavigationState, useFocusEffect, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator, DrawerNavigationOptions } from "@react-navigation/drawer"
import SummaryStackNavigator from "./Summary";
import AuthStackNavigator from "./Auth";
import { linking } from "./linking";
import { RootNavigatorParamList } from "./types";
import { navigationRef } from "./navigationRef";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Dimensions, View } from "react-native";
import { CustomDrawerContent } from "../components/Drawer";
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { useCallback, useEffect, useState } from "react";
import * as Fonts from "expo-font"
import { QueryErrorResetBoundary } from "@tanstack/react-query"
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/supabase/client"
import QuizStackNavigator from "./Quiz";
import DrawerContextProvider, { useDrawer } from "../context/DrawerContext";
import * as SystemNavigationBar from "expo-navigation-bar"
import { darkColors } from "../constants/ui/Colors";

SystemNavigationBar.setVisibilityAsync("hidden")

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
            ? (
              <DrawerContextProvider>
                <MainDrawerNavigator />
              </DrawerContextProvider>
            )
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
  const { options } = useDrawer()

  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerType: "slide",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.primary
        },
        headerTintColor: darkColors.textPrimary,
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
        swipeEdgeWidth:  Dimensions.get('screen').width / 2,
        swipeMinDistance: 20,
        ...options
      })}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name={"Summary"}
        component={SummaryStackNavigator}
        options={({ route }) => {
          return {
            headerTitle: "Cut D' Crop",
            ...options
        }}
        }
      />
      <Drawer.Screen
        name={"Quiz"}
        component={QuizStackNavigator}
        options={({ route }) => {
          return {
            headerTitle: "Quiz",
            lazy: false,
            ...options
          }
        }}
      />
    </Drawer.Navigator >
  )
}


const styles = StyleSheet.create(theme => ({
  headerTitle: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    alignItems: "center"
  },
  headerTitleText: {
    color: darkColors.textPrimary
  }
}))
