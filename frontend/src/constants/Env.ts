import Constants from 'expo-constants'

const vars = Constants.expoConfig?.extra

export const ENV = {
  apiUrl: vars?.API_URL,
  supabaseUrl: vars?.SB_URL,
  supabasePublishableKey: vars?.SB_PUBLISHABLE_KEY
}
