import { createBrowserClient } from "@supabase/ssr";
import config from "@/orm.config";
import { Database } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export const createClient = (): SupabaseClient<Database> =>
  createBrowserClient<Database>(config.supabase.url, config.supabase.anonKey);
