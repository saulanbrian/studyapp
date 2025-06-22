import { useThemeContext } from '@/context/Theme'
import UserChannelContextProvider from '@/context/UserChannelContext'
import { SignedIn, useAuth } from '@clerk/clerk-expo'
import { Tabs } from 'expo-router'
import { Feather } from '@expo/vector-icons'

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
            headerStyle: {
              backgroundColor: theme.surface,
              shadowColor: theme.surface,
            },
            headerTintColor: theme.textPrimary,
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
          <Tabs.Screen name='index' options={{ headerTitle: 'home' }} />
          <Tabs.Screen name='dashboard' />
        </Tabs>
      </UserChannelContextProvider>
    </SignedIn>
  )
}

