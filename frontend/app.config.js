import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    API_URL: process.env.EXPO_PUBLIC_API_URL,
    SB_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    SB_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  }
})
