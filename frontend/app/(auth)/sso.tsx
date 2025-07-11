import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useSignIn, useSignUp, useSSO } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'

import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser'
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { AntDesign, Feather, FontAwesome5, Fontisto, MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useThemeContext } from "@/context/Theme";
import welcomeAnimation from '@/assets/animation/welcome.json'
import { TextInput } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { AnimatedThemedView } from "@/components/ui/ThemedView";
import { FadeIn } from "react-native-reanimated";


WebBrowser.maybeCompleteAuthSession()

enum SocialAuthProvider {
  Google = 'google'
}

const SSOPage = () => {

  const { theme } = useThemeContext()
  const router = useRouter()

  useWarmUpBrowser()

  return (
    <AnimatedThemedView
      style={styles.container}
      entering={FadeIn.duration(1000)}
    >
      <ThemedText style={styles.headerText}>Ready to learn in an efficient way?</ThemedText>
      <ThemedView style={styles.lottieViewContainer}>
        <LottieView
          source={require('@/assets/animation/welcome.json')}
          autoPlay
          loop
          style={styles.lottieView}
          colorFilters={
            welcomeAnimation.layers.map(layer => ({
              keypath: layer.nm,
              color: theme.background
            }))
          }
        />
      </ThemedView>
      <SocialButtons />
      <ThemedView style={styles.buttonSeparator}>
        <ThemedView style={styles.line} surface />
        <ThemedText secondary>or</ThemedText>
        <ThemedView style={styles.line} surface />
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            { backgroundColor: theme.surface },
            styles.button
          ]}
          onPress={() => router.navigate({ pathname: '/(auth)/signup' })}
        >
          <Fontisto
            name='email'
            size={20}
            color={theme.iconPrimary}
          />
          <ThemedText style={styles.buttonText}>
            continue with email
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </AnimatedThemedView>
  );
};


const SocialButtons = () => {

  const { theme } = useThemeContext()
  const { startSSOFlow } = useSSO()

  const redirectUrl = useMemo(() => {
    return Linking.createURL('sso', { scheme: 'cutdcrop' })
  }, [])

  const handleAuth = useCallback(async (provider: SocialAuthProvider) => {
    const { createdSessionId, setActive } = await startSSOFlow({
      redirectUrl,
      strategy: `oauth_${provider}`,
    })
    if (createdSessionId) {
      setActive!({ session: createdSessionId })
    }
  }, [])


  return (
    <ThemedView style={styles.buttonContainer}>
      <TouchableOpacity
        style={[
          { backgroundColor: theme.surface },
          styles.button
        ]}
        onPress={() => handleAuth(SocialAuthProvider.Google)}
      >
        <AntDesign
          name='google'
          size={20}
          color={theme.iconPrimary}
        />
        <ThemedText style={styles.buttonText}>Sign in with Google</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )

}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    gap: 4,
    width: '100%',
  },
  buttonSeparator: {
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  buttonText: {
    fontSize: 20,
    letterSpacing: 1,
    textTransform: 'capitalize',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12
  },
  headerText: {
    fontSize: 40,
  },
  line: {
    flexGrow: 1,
    height: 3
  },
  lottieView: {
    height: 400,
    width: 400,
  },
  lottieViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SSOPage;
