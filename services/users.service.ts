"use server";

import { createClient } from "@/utils/supabase/server";
import { getAnalyticDataById } from "./analytics.service";
import { getAuthUser } from "./auth.service";
import { Tables } from "@/types/supabase";

export async function createUserIfNotExists() {
    const supabase = await createClient();
    const user = await getAuthUser();

    if (!user) {
        return new Response("User not authenticated", { status: 401 });
    }

    const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select()
        .eq("auth_id", user.id)
        .single();

    if (!existingUser) {
        const { data, error } = await supabase
            .from("users")
            .insert({ auth_id: user.id, name: user.email })
            .select()
            .single();
        console.log("Auth user did not exists, user created successfuly:", data);
        if (error) {
            return new Response(JSON.stringify({ error }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
        return new Response(JSON.stringify({ data, error }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    }
}

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