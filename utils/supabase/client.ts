import { createBrowserClient } from "@supabase/ssr";
import config from "@/utils/config";

export const createClient = () =>
  createBrowserClient(config.supabase.url, config.supabase.anonKey);
