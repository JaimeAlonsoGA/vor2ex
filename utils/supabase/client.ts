import { createBrowserClient } from "@supabase/ssr";
import config from "@/orm.config";

export const createClient = () =>
  createBrowserClient(config.supabase.url, config.supabase.anonKey);
