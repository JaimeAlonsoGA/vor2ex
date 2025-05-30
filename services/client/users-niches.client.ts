"use client";

import { createClient } from "@/utils/supabase/client";
import { getNicheIdByKeyword } from "../niches.server";
import { Tables } from "@/types/supabase";
import { getUser } from "../auth.server";

export async function deleteUserNicheByKeyword(keyword: string): Promise<{ success: boolean }> {
    const supabase = createClient();
    const niche = await getNicheIdByKeyword(keyword);
    const user = await getUser();

    const { error } = await supabase
        .from("users_niches")
        .delete()
        .eq("user_id", user.id)
        .eq("niche_id", niche);

    if (error) throw new Error("Error deleting user niches");

    console.log("User niches deleted successfully for user:", user, "and keyword:", keyword);
    return { success: true };
}


export async function saveNiche(keyword: string): Promise<Tables<"users_niches">> {
    const supabase = createClient();
    const user = await getUser();
    const niche = await getNicheIdByKeyword(keyword);

    const { data, error } = await supabase
        .from("users_niches")
        .insert({ analytic_id: niche, user_id: user.id })
        .select()
        .single();

    if (error) throw new Error(`Error saving niches data: ${error.message}`);

    console.log("Niches data saved for user:", user);
    return data;
}

