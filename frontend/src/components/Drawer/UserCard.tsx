import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { StyleSheet } from "react-native-unistyles";
import { Image } from "expo-image"
import { ActivityIndicator, ViewProps } from "react-native";
import { supabase } from "@/src/lib/supabase";
import { useUser } from "@/src/hooks/useUser";
import { useGetProfile } from "@/src/api/queries/profiles";

export default function UserCard({
  style,
  ...props
}: Omit<ViewProps, "children">) {

  const { data: profile, isLoading } = useGetProfile()

  if (isLoading) return <ActivityIndicator />

  return (
    <ThemedView
      style={[styles.container, style]}
      surface
      {...props}
    >
      <Image
        source={profile?.avatar_url ?? require("@/assets/images/react-logo.png")}
        style={styles.image}
        contentFit={"cover"}
      />
      <ThemedText
        style={styles.email}
        fw="bold"
      >
        {profile?.display_name}
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create(theme => ({
  container: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  email: {
    fontWeight: '700'
  },
  image: {
    borderRadius: theme.radii.pill,
    height: 44,
    aspectRatio: 1
  }
}))
