import Constants from 'expo-constants'

const vars = Constants.expoConfig?.extra

export const ENV = {
  clerkKey: vars?.CLERK_PUBLISHABLE_KEY,
  apiUrl: vars?.API_URL,
  websocketUrl: vars?.WS_URL,
  supabaseUrl: vars?.SB_URL,
  supabasePublishableKey: vars?.SB_PUBLISHABLE_KEY
}
