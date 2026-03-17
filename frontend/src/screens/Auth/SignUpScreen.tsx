import { useAuth } from "@/src/api/hooks/auth/useAuth";
import { ThemedScreen, ThemedText, ThemedTextInput } from "@/src/components";
import ActionButton from "@/src/components/ActionButton";
import VerificationCodeInput from "@/src/components/Auth/VerificationCodeInput";
import { darkColors } from "@/src/constants/ui/Colors";
import { supabase } from "@/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { MutationStatus } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native-unistyles";

export default function SignUpScreen() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<AuthError>()
  const [status, setStatus] = useState<MutationStatus>("idle")
  const [verifying, setVerifying] = useState(false)

  styles.useVariants({
    disabled: !email || !password
  })

  const handlePress = useCallback(async () => {
    setStatus("pending")
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) {
      console.log(JSON.stringify(error, undefined, 2))
      setError(error)
      setStatus("error")
      return
    }
    setVerifying(true)
  }, [email, password])

  if (verifying) {
    return <Verification email={email} />
  }

  return (
    <ThemedScreen style={styles.screen}>
      <ThemedText
        style={styles.text}
        size={"lg"}
        fw={"semiBold"}
      >
        Enter your email
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
      {error && (
        <ThemedText
          color={"error"}
          size={"sm"}
          style={styles.error}
        >
          {error.message}
        </ThemedText>
      )}
      <ActionButton
        title={"continue"}
        status={status}
        onPress={handlePress}
        disabled={!email || !password}
        style={styles.button}
      />
    </ThemedScreen>
  )
}

const Verification = ({ email }: { email: string }) => {

  const [verification, setVerification] = useState('')
  const [status, setStatus] = useState<MutationStatus>('idle')
  const [error, setError] = useState<AuthError>()
  const { saveUserId } = useAuth()

  styles.useVariants({
    disabled: verification.split('').length < 8
  })

  const handlePress = useCallback(async () => {
    setStatus("pending")
    setError(undefined)
    const { data, error } = await supabase.auth.verifyOtp({
      type: "email",
      email,
      token: verification
    })
    if (error || !data.session || !data.user) {
      setError(error || new AuthError("session error"))
      setStatus("error")
      return
    }
    await saveUserId(data.user.id)
    await supabase.auth.setSession(data.session)
  }, [verification])

  return (
    <ThemedScreen style={styles.screen}>
      <ThemedText
        size={"lg"}
        fw={"semiBold"}
        style={styles.text}
      >
        Enter verification
      </ThemedText>
      <VerificationCodeInput onChangeCode={setVerification} />
      {error && (
        <ThemedText
          size={"xs"}
          color={"error"}
          style={styles.error}
        >
          {error.message}
        </ThemedText>
      )}
      <ActionButton
        title={"verify"}
        status={status}
        pendingText={"verifying..."}
        onPress={handlePress}
        disabled={verification.split('').length < 8}
        style={styles.button}
      />
      <ThemedText
        size={"sm"}
        style={styles.note}
      >
        Note: not getting an otp sometimes means email is already in use.
      </ThemedText>
    </ThemedScreen>
  )
}

const styles = StyleSheet.create(theme => ({
  error: {
    backgroundColor: darkColors.textPrimary,
    alignSelf: "flex-start",
    padding: theme.spacing.xxs,
    borderRadius: theme.radii.xs
  },
  note: {
    color: theme.colors.warning
  },
  screen: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.xs
  },
  text: {
    color: darkColors.textPrimary
  },
  button: {
    backgroundColor: theme.colors.primaryDark,
    marginVertical: theme.spacing.sm,
    variants: {
      disabled: {
        true: {
          opacity: 0.6
        },
      }
    }
  }
}))

