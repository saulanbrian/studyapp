import { useThemeContext } from '@/context/Theme'
import UserChannelContextProvider from '@/context/UserChannelContext'
import { SignedIn, useAuth } from '@clerk/clerk-expo'
import { Tabs } from 'expo-router'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import { ThemedText, ThemedView } from '@/components/ui'
import { Image } from 'expo-image'
import { StyleSheet, useColorScheme, View } from 'react-native'
import { useMemo } from 'react'

export default function TabLayout() {

  const { theme } = useThemeContext()

  return (
    <SignedIn>
      <UserChannelContextProvider>
        <Tabs
          screenOptions={({ route }) => ({
            sceneStyle: {
              backgroundColor: theme.background
            },
            headerShown: false,
            tabBarStyle: {
              backgroundColor: theme.surface,
              paddingTop: 4,
            },
            animation: 'shift',
            tabBarLabel: "",
            tabBarActiveTintColor: theme.iconPrimary,
            tabBarInactiveTintColor: theme.iconSecondary,
            tabBarIcon: ({ size, color, focused }) => {
              let icon: keyof typeof Feather.glyphMap | null = null

              if (route.name === 'index') {
                icon = 'file-text'
              } else {
                icon = 'grid'
              }

              return (
                <Feather
                  name={icon}
                  color={color}
                  size={size}
                />
              )
            }
          })}
        >
          <Tabs.Screen name='index' />
          <Tabs.Screen name='dashboard' />
        </Tabs>
      </UserChannelContextProvider>
    </SignedIn>
  )
}
