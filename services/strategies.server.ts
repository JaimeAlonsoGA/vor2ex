"use server"
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "./auth.server";

export async function getStrategies(): Promise<Tables<'strategies'>[]> {
    const supabase = await createClient();
    const user = await getUser();

    const { data, error } = await supabase
        .from("strategies")
        .select("*")
        .eq("user_id", user.id);

    if (error) throw new Error("Error fetching strategies");

    return data ?? [];
}