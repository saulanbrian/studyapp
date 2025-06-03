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


WebBrowser.maybeCompleteAuthSession()

enum SocialAuthProvider {
  Facebook = 'facebook',
  Google = 'google'
}

const SSOPage = () => {

  const { theme } = useThemeContext()
  const router = useRouter()

  useWarmUpBrowser()

  return (
    <ThemedView style={styles.container}>
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
      <ThemedText
        style={{ marginVertical: 4 }}
        secondary
      >
        or
      </ThemedText>
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
    </ThemedView>
  );
};


const SocialButtons = () => {

  const { theme } = useThemeContext()
  const { startSSOFlow } = useSSO()

  const handleAuth = useCallback(async (provider: SocialAuthProvider) => {
    const { createdSessionId, setActive } = await startSSOFlow({
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
        <ThemedText style={styles.buttonText}>Google</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          { backgroundColor: theme.surface },
          styles.button
        ]}
        onPress={() => handleAuth(SocialAuthProvider.Facebook)}
      >
        <FontAwesome5
          name='facebook'
          size={20}
          color={theme.iconPrimary}
        />
        <ThemedText style={styles.buttonText}>Facebook</ThemedText>
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
  buttonText: {
    fontSize: 20,
    letterSpacing: 1,
    textTransform: 'capitalize',
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12
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
