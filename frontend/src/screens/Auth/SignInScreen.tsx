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
import { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedKeyboard, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

export default function SignInScreen() {
  return (
    <ThemedScreen style={styles.screen}>
      <Actions />
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
    paddingBottom: withSpring(
      keyboard.height.value ?? 0
    )
  }))

  return (
    <AnimatedThemedView
      style={[rStyles, styles.actionsContainer]}
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
    marginTop: "auto",
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
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

