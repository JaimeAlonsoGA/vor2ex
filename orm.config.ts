const config = {
  amazon: {
    clientId: process.env.AMAZON_CLIENT_ID,
    clientSecret: process.env.AMAZON_CLIENT_SECRET,
    redirectUri: process.env.AMAZON_REDIRECT_URI,
    refreshTokenEU: process.env.AMAZON_REFRESH_TOKEN_EU_WEST,
    refreshTokenUS: process.env.AMAZON_REFRESH_TOKEN_US_EAST,
  },
  alibaba: {
    clientSecret: process.env.ALIBABA_SECRET_ID!,
    appKey: process.env.ALIBABA_APP_KEY!,
  },
  decodo: {
    baseUrl: process.env.DECODO_REALTIME_ENDPOINT!,
    auth: process.env.DECODO_AUTHENTICATION_KEY!,
    password: process.env.DECODO_PASSWORD!,
    access_token: process.env.DECODO_ACCESS_TOKEN!
  },
  base_url: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000/",
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    projectRef: process.env.SUPABASE_PROJECT_REF!,
  },
};

export default config;
