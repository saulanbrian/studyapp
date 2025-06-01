import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useSSO } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'

import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser'
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui";

WebBrowser.maybeCompleteAuthSession()

const SignIn = () => {
  useWarmUpBrowser()
  const { startSSOFlow } = useSSO()
  const redirectUrl = Linking.createURL('/(tabs)')

  async function handleSignIn() {
    const { createdSessionId, setActive } = await startSSOFlow({
      strategy: 'oauth_google',
      redirectUrl,
    })
    if (createdSessionId) {
      setActive!({ session: createdSessionId })
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedButton onPress={handleSignIn}>
        <ThemedText>googlr</ThemedText>
      </ThemedButton>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default SignIn;
