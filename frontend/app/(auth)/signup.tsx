import OnboardingForm, { OnboardingFormRef } from "@/components/OnboardingForm";
import { ThemedInput, ThemedText, ThemedView } from "@/components/ui";
import { useThemeContext } from "@/context/Theme";
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, TextProps, TouchableOpacity } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";

export default function SignUp() {

  const { } = useSignUp()
  const onboardingRef = useRef<OnboardingFormRef>(null)

  return (
    <ThemedView style={{ flex: 1 }}>
      <OnboardingForm
        pages={[
          <EmailInputPage onFinish={() => onboardingRef.current?.next()} />,
          <EmailVerificationPage />
        ]}
        ref={onboardingRef}
      />
    </ThemedView>
  )
}

const EmailInputPage = ({ onFinish }: { onFinish: () => void }) => {

  const { signUp, isLoaded } = useSignUp()
  const [email, setEmail] = useState<string>()
  const [error, setError] = useState<string>()
  const router = useRouter()

  const sendVerification = useCallback(async () => {
    if (!isLoaded) return
    try {

      await signUp.create({
        emailAddress: email,
      })

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      onFinish()

    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        const { message, longMessage } = e.errors[0]
        setError(longMessage || message)
      }
    }
  }, [isLoaded, signUp, email])

  return (
    <ThemedView style={styles.page}>
      <ThemedText >contine with email</ThemedText>
      <ThemedInput
        value={email}
        onChangeText={setEmail}
        placeholder={'example@email.com'}
      />
      {error && (
        <ErrorText>{error}</ErrorText>
      )}
      <TouchableOpacity onPress={sendVerification}>
        <ThemedText>send code</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace({ pathname: '/(auth)/signin' })}>
        <ThemedText>signin instead</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )
}


const EmailVerificationPage = () => {

  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()
  const { signUp, isLoaded, setActive } = useSignUp()

  const handleVerify = useCallback(async () => {
    if (!isLoaded) return

    try {
      const { status, createdSessionId } = await signUp.attemptEmailAddressVerification({ code })
      console.log(status)
      if (status === 'complete') {
        setActive({ session: createdSessionId })
      }
    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        const { longMessage, message } = e.errors[0]
        setError(longMessage || message)
      }
    }

  }, [signUp, isLoaded, code])

  return (
    <ThemedView>
      <ThemedText>verify yiur email</ThemedText>
      <ThemedInput
        value={code}
        onChangeText={setCode}
        placeholder={"enter your code here..."}
      />
      {error && (
        <ErrorText>{error}</ErrorText>
      )}
      <TouchableOpacity onPress={handleVerify}>
        <ThemedText>veirify</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )
}

const ErrorText = ({ style, ...props }: TextProps) => {

  const { theme } = useThemeContext()

  return (
    <ThemedText
      style={[{ color: theme.error }, styles.errorText, style]}
      {...props}
    />
  )
}


const styles = StyleSheet.create({
  errorText: {
    fontSize: 12
  },
  page: {
    flex: 1,
    padding: 8,
    gap: 2
  }
})
