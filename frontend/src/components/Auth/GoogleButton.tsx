import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/src/api/hooks/auth/useAuth'
import { StyleSheet } from 'react-native-unistyles'
import { Pressable, PressableProps } from 'react-native'
import { useCallback } from 'react'
import ThemedText from '../ThemedText'
import { darkColors } from '@/src/constants/ui/Colors'
import { AntDesign } from '@expo/vector-icons'

GoogleSignin.configure({
  webClientId: "643870734379-vf6av7j0hlf3g8vpsshes8vtsg2jad1h.apps.googleusercontent.com",
  offlineAccess: true,
  forceCodeForRefreshToken: true
})

export default function GoogleButton({
  style,
  ...props
}: Omit<PressableProps, 'onPress'>) {

  const { saveUserId } = useAuth()

  const signIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn()
      if (isSuccessResponse(response)) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.data.idToken!,
        })
        if (!error) {
          await saveUserId(data.user.id)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <Pressable
      onPress={signIn}
      style={props => [
        styles.button,
        typeof style === "function"
          ? style(props)
          : style
      ]}
      {...props}
    >
      <AntDesign
        name={"google"}
        color={darkColors.textPrimary}
        size={20}
      />
      <ThemedText
        fw={"semiBold"}
        style={styles.buttonText}
      >
        continue with google
      </ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create(theme => ({
  button: {
    flexDirection: "row",
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: darkColors.background,
    borderRadius: theme.radii.pill
  },
  buttonText: {
    color: darkColors.textPrimary
  }
}))
