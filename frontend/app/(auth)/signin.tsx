import { CodeInput } from "@/components";
import { CodeInputRef } from "@/components/CodeInput";
import OnboardingForm, { OnboardingFormRef } from "@/components/OnboardingForm";
import { ThemedInput, ThemedText, ThemedView } from "@/components/ui";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Pressable } from "react-native-gesture-handler";


export default function SignInPage() {

  const formRef = useRef<OnboardingFormRef | null>(null)

  return (
    <ThemedView style={{ flex: 1 }}>
      <OnboardingForm
        ref={formRef}
        pages={[
          <EmailInputPage onFinish={() => formRef.current?.next()} />,
          <EmailVerificationPage />
        ]}
      />
    </ThemedView>
  )
}

const EmailInputPage = ({ onFinish }: { onFinish: () => void }) => {

  const { signIn, isLoaded, setActive } = useSignIn()
  const [email, setEmail] = useState('')

  const handleSignIn = useCallback(async () => {

    if (!isLoaded) return

    try {

      await signIn.create({ identifier: email })

      await signIn.prepareFirstFactor({
        strategy: 'email_code',
        emailAddressId: signIn.supportedFirstFactors!.find(f => f.strategy === 'email_code')?.emailAddressId!
      })

      onFinish()

    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        console.error(error)
      }
    }
  }, [isLoaded, signIn, setActive, email])

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedInput
        value={email}
        onChangeText={setEmail}
        placeholder='example@email.com'
      />
      <TouchableOpacity onPress={handleSignIn}>
        <ThemedText>signin</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )
}


const EmailVerificationPage = () => {

  const { isLoaded, signIn, setActive } = useSignIn()
  const codeInputRef = useRef<CodeInputRef>(null)

  const handleVerify = async () => {

    if (!isLoaded || !codeInputRef.current?.code) return

    try {
      await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code: codeInputRef.current.code
      })
      setActive!({ session: signIn.createdSessionId })
    } catch (error) {

    }
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <CodeInput ref={codeInputRef} />
      <TouchableOpacity onPress={handleVerify}>
        <ThemedText>submit</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  hiddenInput: {
    height: 0,
    width: 0,
    position: 'absolute',
    opacity: 0
  }
})
