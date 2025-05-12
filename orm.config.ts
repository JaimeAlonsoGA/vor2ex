const config = {
  amazon: {
    clientId: process.env.AMAZON_CLIENT_ID,
    clientSecret: process.env.AMAZON_CLIENT_SECRET,
    redirectUri: process.env.AMAZON_REDIRECT_URI,
    refreshToken: process.env.AMAZON_REFRESH_TOKEN,
    marketplaceId_spain: process.env.AMAZON_SPAIN_MARKETPLACE_ID!,
    endpoint_eu: process.env.AMAZON_EU_ENDPOINT!,
    endpoint_na: process.env.AMAZON_NA_ENDPOINT!,
  },
  base_url: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000",
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
};

export default config;
