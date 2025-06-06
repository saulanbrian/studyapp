import { isClerkAPIResponseError, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";


type EmailAuthViewContextType = {
  method: 'signin' | 'signup';
  error: string | null;
  emailToVerify: string | null;
  attemptVerification: (code: string) => void;
  sendVerificationCode: (
    email: string,
    onSuccess: () => void
  ) => void
}

const EmailAuthViewContext = createContext<EmailAuthViewContextType | null>(null)


export const useEmailAuth = () => {
  const context = useContext(EmailAuthViewContext)
  if (!context) throw new Error(
    'cannot use EmailAuthContext outside its provider'
  )
  return context
}

type EmailAuthViewContextProviderProps = PropsWithChildren & {
  method: 'signin' | 'signup'
}

export default function EmailAuthViewContextProvider({
  method,
  children
}: EmailAuthViewContextProviderProps) {

  const [error, setError] = useState<string | null>(null)
  const [emailToVerify, setEmailToVerify] = useState<string | null>(null)

  const {
    isLoaded,
    signIn,
    setActive: setActiveSignIn
  } = useSignIn()

  const {
    signUp,
    setActive: setActiveSignUp
  } = useSignUp()


  const sendVerificationCode = useCallback(async (
    email: string,
    onSuccess: () => void
  ) => {
    if (!isLoaded) return

    try {

      setError(null)

      if (method === 'signin') {

        await signIn.create({ identifier: email })

        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId: signIn.supportedFirstFactors?.find(
            f => f.strategy === 'email_code'
          )?.emailAddressId!
        })

      } else {

        await signUp!.create({ emailAddress: email })

        await signUp?.prepareEmailAddressVerification({
          strategy: 'email_code'
        })

      }

      setEmailToVerify(email)
      onSuccess()

    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        const { message, longMessage } = e.errors[0]
        setError(longMessage || message)
      }
    }

  }, [method, isLoaded, error, emailToVerify])


  const attemptVerification = useCallback(async (code: string) => {

    if (!isLoaded) return

    try {

      setError(null)

      if (method === 'signin') {
        const { createdSessionId } = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code
        })
        if (createdSessionId) {
          setActiveSignIn({ session: createdSessionId })
        }
      } else {
        const { createdSessionId } = await signUp!.attemptEmailAddressVerification({
          code
        })
        if (createdSessionId) {
          setActiveSignUp!({ session: createdSessionId })
        }

      }

    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        const { message, longMessage } = e.errors[0]
        setError(longMessage || message)
      }
    }

  }, [method, isLoaded, setActiveSignIn, setActiveSignUp, error])

  return (
    <EmailAuthViewContext.Provider value={{
      method,
      sendVerificationCode,
      error,
      attemptVerification,
      emailToVerify
    }}>
      {children}
    </EmailAuthViewContext.Provider>
  )

}
