import { Card, ThemedButton, ThemedText, ThemedView, UserAvatar } from "@/components/ui"
import { useThemeContext } from "@/context/Theme"
import { useAuth, useUser } from "@clerk/clerk-expo"
import { Feather, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons"
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native"

export default function DashBoard() {

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity>
        <UserContainer />
      </TouchableOpacity>
      <ThemedView style={styles.cardsContainer}>
        <QuizzesCard />
        <FavoritesCard />
      </ThemedView>
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

  return (
    <TouchableOpacity>
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

  return (
    <TouchableOpacity>
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
    gap: 2
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
