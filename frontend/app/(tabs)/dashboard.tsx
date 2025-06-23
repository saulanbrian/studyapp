import { Card, ThemedButton, ThemedText, ThemedView, UserAvatar } from "@/components/ui"
import { useThemeContext } from "@/context/Theme"
import { useAuth, useUser } from "@clerk/clerk-expo"
import { Feather, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons"
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { useCallback, useRef } from "react"
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native"

export default function DashBoard() {

  const queryClient = useQueryClient()
  const sheetRef = useRef<BottomSheetModal>(null)
  const { signOut } = useAuth()
  const { theme } = useThemeContext()

  const handleSignout = useCallback(() => {
    queryClient.clear()
    signOut()
  }, [])

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={() => sheetRef.current?.present()}>
        <UserContainer />
      </TouchableOpacity>
      <ThemedView style={styles.cardsContainer}>
        <QuizzesCard />
        <FavoritesCard />
      </ThemedView>
      <BottomSheetModal
        ref={sheetRef}
        backgroundStyle={{ backgroundColor: theme.surface }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            {...props}
          />
        )}
      >
        <BottomSheetView>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignout}
          >
            <Feather
              name='log-out'
              size={24}
              color={theme.error}
            />
            <ThemedText
              style={[
                { color: theme.error },
                styles.signOutButtonText
              ]}
            >
              signout
            </ThemedText>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </ThemedView>
  )
}


const UserContainer = () => {

  const { user } = useUser()

  return (
    <Card style={styles.userContainer}>
      <UserAvatar />
      <ThemedText style={styles.userEmail}>
        {user?.emailAddresses[0].toString()!}
      </ThemedText>
    </Card>
  )
}


const QuizzesCard = () => {

  const { theme: { textPrimary } } = useThemeContext()
  const router = useRouter()

  const handlePress = useCallback(() => {
    router.push({ pathname: '/(quiz)/my-quizzes' })
  }, [])

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card style={styles.card}>
        <SimpleLineIcons
          name='game-controller'
          size={40}
          color={textPrimary}
        />
        <ThemedText style={styles.cardTitle}>Quizzes</ThemedText>
      </Card>
    </TouchableOpacity>
  )
}


const FavoritesCard = () => {

  const { theme: { textPrimary } } = useThemeContext()
  const router = useRouter()

  const handlePress = useCallback(() => {
    router.push({
      pathname: '/(summary)/favorites',
    })
  }, [])

  return (
    <TouchableOpacity onPress={handlePress
    }>
      <Card style={styles.card}>
        <MaterialIcons
          name='favorite-outline'
          size={44}
          color={textPrimary}
        />
        <ThemedText style={styles.cardTitle}>favorites</ThemedText>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 4,
    height: Dimensions.get('screen').width / 2 - 12,
    width: Dimensions.get('screen').width / 2 - 12,
    alignSelf: 'flex-start'
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    alignItems: 'center',
    padding: 4,
    justifyContent: 'space-around'
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 4,
    paddingTop: 6,
    gap: 2
  },
  signOutButton: {
    margin: 12,
    padding: 8,
    gap: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signOutButtonText: {
    fontSize: 20,
    letterSpacing: 2
  },
  userContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    padding: 8,
    paddingLeft: 12,
    borderRadius: 36
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'bold'
  }
})
