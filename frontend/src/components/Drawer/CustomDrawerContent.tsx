import { StyleSheet, useUnistyles } from "react-native-unistyles";
import UserCard from "./UserCard";
import { DrawerContent, DrawerContentComponentProps, DrawerItemList } from "@react-navigation/drawer";
import Constants from "expo-constants";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { ThemedText, ThemedView, ThemedAlert } from "@/src/components"
import { useCallback, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/src/api/hooks/auth/useAuth"

export default function CustomDrawerContent(props: DrawerContentComponentProps) {

  return (
    <ThemedView style={styles.container} surface >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flex: 1 }}
      >
        <UserCard />
        <DrawerItemList {...props} />
        <Footer />
        <LogoutButton />
      </ScrollView>
    </ThemedView>
  )
}


const LogoutButton = () => {

  const { theme } = useUnistyles()
  const [modalVisible, setModalVisible] = useState(false)
  const { signOut } = useAuth()

  const handlePress = useCallback(() => {
    setModalVisible(true)
  }, [])

  return (
    <View>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handlePress}
      >
        <FontAwesome
          name={"arrow-left"}
          color={theme.colors.error}
          size={theme.fontSize.sm}
        />
        <ThemedText
          color={"error"}
          size={"md"}
          fw={"semiBold"}
          style={{ letterSpacing: 2 }}
        >
          logout
        </ThemedText>
        <ThemedAlert
          visible={modalVisible}
          title="Sign Out"
          text="are you sure you want to signout? "
          primaryAction={{
            onDispatch: signOut,
            title: "continue",
            warning: true
          }}
          secondaryAction={{
            onDispatch: () => setModalVisible(false),
            title: "cancel"
          }}
        />
      </TouchableOpacity>
    </View>
  )
}

const Footer = () => {
  return (
    <View style={styles.footer}>
      <ThemedText color={"secondary"} size={"xs"}>
        Cut D' Crop v2.0.0
      </ThemedText>
      <ThemedText color={"secondary"} size={"xs"}>
        © 2026 | Brian Saulan
      </ThemedText>
    </View>
  )
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.neutral300,
    margin: theme.spacing.md / 2,
    marginTop: theme.spacing.md
  },
  logoutBtn: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    alignItems: "center"
  },
  footer: {
    marginTop: "auto",
    paddingLeft: theme.spacing.sm
  },
  scrollView: {
    flex: 1,
    flexGrow: 1,
    padding: theme.spacing.md,
  },
  userCard: {
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.lg
  }
}))
