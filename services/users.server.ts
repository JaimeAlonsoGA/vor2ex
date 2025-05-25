"use server";

import { createClient } from "@/utils/supabase/server";
import { getAuthUser } from "./auth.server";
import { Tables } from "@/types/supabase";

export async function getUserData(): Promise<Tables<'users'>> {
    const supabase = await createClient();
    const userId = await getAuthUser();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
        .from("users")
        .select()
        .eq("auth_id", userId?.id)
        .single();
    if (error) {
        throw new Error(`Error fetching user data: ${error.message}`);
    }

    return data;
}