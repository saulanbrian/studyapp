import { ThemedScreen, ThemedText } from "@/src/components";
import ThemedButton, { AnimatedThemedButton } from "@/src/components/ThemedButton";
import { S } from "@/src/constants/Styles";
import { useSSO } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser"
import * as Linking from "expo-linking"
import { useCallback, useMemo } from "react";

WebBrowser.maybeCompleteAuthSession()

export default function SSOScreen() {

  const { startSSOFlow } = useSSO()
  const redirectUrl = useMemo(() => {
    return Linking.createURL('auth/sso', { scheme: "cutdcrop" })
  }, [])

  const handlePress = useCallback(async () => {
    const { createdSessionId, setActive } = await startSSOFlow({
      strategy: "oauth_google",
      redirectUrl
    })
    if (createdSessionId) {
      setActive!({ session: createdSessionId })
    }
  }, [])

  return (
    <ThemedScreen style={S.centerContainer}>
      <ThemedButton title={"signin"} onPress={handlePress} />
    </ThemedScreen>
  )
}
