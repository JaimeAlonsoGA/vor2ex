"use server"

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export async function getUser(): Promise<User> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data?.user) return data.user;
  throw new Error("User not authenticated");
}
