import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OnboardingForm, { OnboardingFormRef } from "../OnboardingForm";
import { ThemedInput, ThemedText, ThemedView } from "../ui";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useThemeContext } from "@/context/Theme";
import EmailAuthViewContextProvider, { useEmailAuth } from "./context";
import CodeInput, { CodeInputRef } from "../CodeInput";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

type EmailAuthMethod = {
  method: 'signin' | 'signup'
}

export default function EmailAuthView({
  method
}: EmailAuthMethod) {

  const onboardingFormRef = useRef<OnboardingFormRef>(null)
  const navigation = useNavigation()

  useEffect(() => {
    const backListener = navigation.addListener(
      'beforeRemove',
      (e) => {
        if (
          onboardingFormRef.current?.currentPage
          && onboardingFormRef.current.currentPage > 1
        ) {
          e.preventDefault()
          onboardingFormRef.current?.back()
        } else {
          navigation.dispatch(e.data.action)
        }
      }
    )

    return backListener
  }, [])

  return (
    <EmailAuthViewContextProvider method={method} >
      <ThemedView style={{ flex: 1 }}>
        <OnboardingForm
          pages={[
            <EmailInputView
              onProcessFinish={() => {
                onboardingFormRef.current?.next()
              }} />,
            <EmailCodeVerification />
          ]}
          ref={onboardingFormRef}
        />
      </ThemedView>
    </EmailAuthViewContextProvider>
  )
}

const EmailInputView = ({
  onProcessFinish,
}: { onProcessFinish: () => void }) => {

  const [email, setEmail] = useState('')

  const { sendVerificationCode, method } = useEmailAuth()
  const { theme } = useThemeContext()

  const handlePress = useCallback(() => {
    sendVerificationCode(email, onProcessFinish)
  }, [email, sendVerificationCode])

  const headerText = useMemo(() => {
    return method === 'signin'
      ? 'Welcome back, learner!'
      : 'Signup Now!'
  }, [method])

  const subHeaderText = useMemo(() => {
    return method === 'signin'
      ? 'missed simplified learning?'
      : 'and join us in an exciting and efficient way of learning'
  }, [method])

  return (
    <ThemedView style={styles.page}>
      <ThemedText
        style={styles.header}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {headerText}
      </ThemedText>
      <ThemedText
        style={styles.subHeader}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {subHeaderText}
      </ThemedText>
      <ThemedView style={styles.inputContainer}>
        <ThemedText style={styles.emailHeader}>
          Enter your email
        </ThemedText>
        <ThemedInput
          value={email}
          onChangeText={setEmail}
          placeholder={'example@email.com'}
          style={styles.emailInput}
        />
        <EmailAuthError />
      </ThemedView>
      <TouchableOpacity
        style={[
          { backgroundColor: theme.iconPrimary },
          styles.button
        ]}
        onPress={handlePress}
      >
        <ThemedText
          style={[
            { color: theme.background },
            styles.buttonText
          ]}
        >
          send code
        </ThemedText>
      </TouchableOpacity>
      <ChangeMethodHref />
    </ThemedView>
  )
}


const EmailCodeVerification = () => {

  const { attemptVerification, emailToVerify } = useEmailAuth()
  const { theme } = useThemeContext()

  const inputRef = useRef<CodeInputRef>(null)

  const handlePress = useCallback(() => {
    if (!inputRef.current?.code) return
    attemptVerification(inputRef.current.code)
  }, [attemptVerification])

  return (
    <ThemedView style={styles.page}>
      <ThemedText style={styles.header}>
        Enter verification code
      </ThemedText>
      <ThemedText style={styles.subHeader}>
        we have sent a verification code to
        <Text style={{ color: '#4eb2e6ff', marginHorizontal: 2 }}>
          {emailToVerify}
        </Text> ,verify now
      </ThemedText>
      <ThemedView style={styles.inputContainer} >
        <ThemedText>verification code:</ThemedText>
        <CodeInput ref={inputRef} />
        <EmailAuthError />
      </ThemedView>
      <TouchableOpacity
        style={[
          { backgroundColor: theme.iconPrimary },
          styles.button
        ]}
        onPress={handlePress}>
        <ThemedText
          style={[
            { color: theme.background },
            styles.buttonText
          ]}>
          Verify
        </ThemedText>
      </TouchableOpacity>
      <EmailAuthError />
    </ThemedView>
  )
}



const ChangeMethodHref = () => {

  const { method } = useEmailAuth()
  const router = useRouter()

  const changeMethod = method === 'signin' ? 'signup' : 'signin'

  const handlePress = useCallback(() => {
    router.replace({ pathname: `/(auth)/${changeMethod}` })
  }, [changeMethod])

  return (
    <TouchableOpacity onPress={handlePress}>
      <ThemedText style={styles.href}>
        {changeMethod} instead
      </ThemedText>
    </TouchableOpacity>
  )
}

const EmailAuthError = () => {

  const { error } = useEmailAuth()
  const { theme } = useThemeContext()

  if (!error) return null

  return (
    <ThemedText
      style={{
        color: theme.error,
        marginInline: 8
      }}
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {error}
    </ThemedText>
  )
}


const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  buttonText: {
    letterSpacing: 2,
    fontSize: 20
  },
  emailHeader: {
    marginLeft: 8,
  },
  emailInput: {
    fontSize: 16,
    padding: 12,
    borderRadius: 20,
  },
  inputContainer: {
    gap: 4,
    paddingVertical: 4,
    marginTop: 20
  },
  header: {
    fontSize: 40,
  },
  href: {
    marginLeft: 'auto',
    marginRight: 8,
    marginVertical: 4,
    color: '#4eb2e6ff'
  },
  page: {
    padding: 8,
    flex: 1
  },
  subHeader: {
    fontWeight: 'normal',
    fontSize: 20
  }
})
