"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { getUser } from "./auth.server";

export async function getSettings(): Promise<Tables<'settings'>> {
    const supabase = await createClient();
    const user = await getUser();

    console.log("Fetching settings for user:", user.id);

    const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("auth_id", user.id)
        .single();

    if (error) throw new Error(`Error fetching user settings: ${error.message}`)

    return data ?? {};
}