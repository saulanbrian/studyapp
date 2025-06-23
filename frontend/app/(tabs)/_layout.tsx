import { useThemeContext } from '@/context/Theme'
import UserChannelContextProvider from '@/context/UserChannelContext'
import { SignedIn, useAuth } from '@clerk/clerk-expo'
import { Tabs } from 'expo-router'
import { Feather } from '@expo/vector-icons'
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
            headerStyle: {
              backgroundColor: theme.surface,
              shadowColor: theme.surface,
            },
            headerTitle: () => <HeaderTitle />,
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
          <Tabs.Screen name='index' />
          <Tabs.Screen name='dashboard' />
        </Tabs>
      </UserChannelContextProvider>
    </SignedIn>
  )
}


const Icons = {
  light: require('@/assets/images/icon-light.png'),
  dark: require('@/assets/images/icon-dark.png')
}


const HeaderTitle = () => {

  const colorScheme = useColorScheme()

  return (
    <View style={styles.headerTitleContainer}>
      <Image
        source={Icons[colorScheme || 'light']}
        style={styles.headerTitleImage}
        contentFit='contain'
      />
      <ThemedText style={styles.headerTitleText}>
        Cut D' Crop!
      </ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center'
  },
  headerTitleImage: {
    aspectRatio: 1,
    height: 50
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'condensedBold'
  }
})
