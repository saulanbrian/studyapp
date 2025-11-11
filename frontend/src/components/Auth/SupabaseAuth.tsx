import React, { useState } from 'react'
import { Alert, StyleSheet, TextInput, View } from 'react-native'
import { supabase } from '@/src/lib/supabase'
import { Button, Input } from '@rneui/themed'
import ThemedButton from '../ThemedButton'
import ThemedTextInput from '../ThemedTextInput'
import { useAuth } from '@/src/api/auth/useAuth'

export default function SupabaseAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [runningVerification, setRunningVerification] = useState(false)
  const { saveUserId } = useAuth()

  async function signInWithEmail() {
    setLoading(true)
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message)
    } else {
      await saveUserId(data.user.id)
    }

    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
    setRunningVerification(true)
  }

  if (runningVerification) return <EmailConfirmation email={email} />

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <ThemedTextInput
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <ThemedTextInput
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <ThemedButton title="Sign In" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View style={styles.verticallySpaced}>
        <ThemedButton title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
    </View>
  )
}


const EmailConfirmation = ({ email }: { email: string }) => {

  const [code, setCode] = useState('')
  const { saveUserId } = useAuth()

  const handlePress = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      type: "email", token: code, email
    })
    if (error) {
      Alert.alert(error.message)
    } else {
      await saveUserId(data.user!.id)
      supabase.auth.setSession(data.session!)
    }
  }

  return (
    <View style={{ paddingTop: 50 }}>
      <TextInput
        placeholder={"enter code"}
        value={code}
        onChangeText={setCode}
      />
      <ThemedButton title={"suvmit"} onPress={handlePress} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})
