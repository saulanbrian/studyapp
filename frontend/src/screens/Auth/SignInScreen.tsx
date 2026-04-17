import { useAuth } from "@/src/api/hooks/auth/useAuth";
import { ThemedScreen, ThemedText, ThemedTextInput } from "@/src/components";
import ActionButton from "@/src/components/ActionButton";
import GoogleButton from "@/src/components/Auth/GoogleButton";
import { AnimatedThemedView } from "@/src/components/ThemedView";
import { darkColors } from "@/src/constants/ui/Colors";
import { AuthStackNavigationProp } from "@/src/navigation/Auth/types";
import { supabase } from "@/supabase/client";
import { useNavigation } from "@react-navigation/native";
import { AuthError } from "@supabase/supabase-js";
import { MutationStatus } from "@tanstack/react-query";
import LottieView from "lottie-react-native";
import { useCallback, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedKeyboard, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export default function SignInScreen() {

  const { colors } = useUnistyles().theme

  return (
    <ThemedScreen style={styles.screen}>
      <View style={{ flex: 1, backgroundColor: "red" }}>
        <LottieView
          source={require("@/assets/lotties/welcome_character.json")}
          style={styles.lottieView}
          autoPlay
        />
      </View>
      <View style={{
        backgroundColor: colors.primaryDark,
        flex: 1
      }}>
        <Actions />
      </View>
    </ThemedScreen>
  )
}


function Actions() {

  const { saveUserId } = useAuth()
  const keyboard = useAnimatedKeyboard()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<MutationStatus>('idle')
  const [authError, setAuthError] = useState<AuthError>()

  const hanldeSignIn = useCallback(async () => {
    setAuthError(undefined)
    setStatus('pending')
    const { data, error } = await supabase
      .auth
      .signInWithPassword({
        email,
        password
      })
    if (error) {
      setAuthError(error)
      setStatus("error")
      return
    }
    await saveUserId(data.user.id)
    setStatus('success')
    return
  }, [email, password])

  const rStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(
          keyboard.height.value
            ? -keyboard.height.value - 16
            : -16,
          { damping: 400 }
        )
      }
    ]
  }))

  return (
    <AnimatedThemedView
      style={[styles.actionsContainer, rStyles]}
    >
      <ThemedText
        style={styles.titleText}
        size={"lg"}
        fw={"semiBold"}
      >
        Sign in to your account
      </ThemedText>
      <ThemedTextInput
        placeholder={"example@email.com"}
        value={email}
        onChangeText={setEmail}
      />
      <ThemedTextInput
        placeholder={"password"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <ActionButton
        title={"Sign In"}
        status={status}
        onPress={hanldeSignIn}
        pendingText={"signing in..."}
        disabled={!email || !password}
      />
      <SignupAnchor />
      {authError && (
        <ThemedText color={"error"}>
          {authError.message}
        </ThemedText>
      )}
      <MethodSeparator />
      <GoogleButton style={styles.googleButton} />
    </AnimatedThemedView>
  )
}

const MethodSeparator = () => {

  return (
    <View style={styles.separator}>
      <View style={styles.separatorLine} />
      <ThemedText
        style={styles.separatorText}
      >
        or
      </ThemedText>
      <View style={styles.separatorLine} />
    </View>
  )
}

const SignupAnchor = () => {

  const navigation = useNavigation<AuthStackNavigationProp>()

  const handlePress = useCallback(() => {
    navigation.navigate("SignUp")
  }, [])

  return (
    <TouchableOpacity onPress={handlePress}>
      <ThemedText
        size={"xs"}
        style={styles.signUpAnchor}
      >
        don't have an account? signup instead
      </ThemedText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create(theme => ({
  screen: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 0,
  },
  separator: {
    marginVertical: theme.spacing.md,
    alignItems: "center",
    flexDirection: "row"
  },
  separatorLine: {
    flex: 1,
    backgroundColor: darkColors.textSecondary,
    height: StyleSheet.hairlineWidth
  },
  separatorText: {
    color: darkColors.textSecondary,
    marginHorizontal: theme.spacing.xs
  },
  actionsContainer: {
    backgroundColor: theme.colors.primaryDark,
    borderTopRightRadius: theme.radii.lg,
    borderTopLeftRadius: theme.radii.lg,
    borderBottomWidth: 0,
    borderColor: darkColors.textPrimary,
    marginTop: "auto",
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.lg * 1.5,
    gap: theme.spacing.xs,
    zIndex: 999
  },
  lottieView: {
    width: Dimensions.get("screen").width,
    aspectRatio: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
  googleButton: {
    marginBottom: theme.spacing.lg
  },
  signInButton: {
    justifyContent: "center",
    borderRadius: theme.radii.lg
  },
  signUpAnchor: {
    color: theme.colors.warning
  },
  titleText: {
    color: darkColors.textPrimary,
    marginVertical: theme.spacing.md,
    alignSelf: "center"
  }
}))

