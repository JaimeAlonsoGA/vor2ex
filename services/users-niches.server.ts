"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { getUser } from "./auth.server";

export async function getUserNichesData(): Promise<Tables<'niches'>[]> {
    const supabase = await createClient();
    const user = await getUser();

    const { data, error } = await supabase
        .from("users_niches")
        .select("niches: niche_id (*)")
        .eq("user_id", user.id);

    if (error) {
        throw new Error("Error fetching user niches");
    }

    const niches = (data ?? [])
        .map((item) => item.niches)
        .filter((niche): niche is Tables<'niches'> => !!niche);

    return niches;
}

export async function getUserNichesKeywords(): Promise<Tables<'niches'>['keyword'][]> {
    const supabase = await createClient();
    const user = await getUser();

    const { data, error } = await supabase
        .from("users_niches")
        .select("niches: niche_id (keyword)")
        .eq("user_id", user.id);

    if (error) {
        throw new Error("Error fetching user niches by ID");
    }

    const keywords = (data ?? [])
        .map((item) => item.niches)
        .filter((niche): niche is { keyword: Tables<'niches'>['keyword'] } => !!niche)
        .map((niche) => niche.keyword);

    return keywords;
}


export async function getUserNichesIds(): Promise<Tables<'niches'>['id'][]> {
    const supabase = await createClient();
    const user = await getUser();

    const { data, error } = await supabase
        .from("users_niches")
        .select("niches: niche_id (id)")
        .eq("user_id", user.id);

    if (error) {
        throw new Error("Error fetching user niches by ID");
    }

    const ids = (data ?? [])
        .map((item) => item.niches)
        .filter((niche): niche is { id: Tables<'niches'>['id'] } => !!niche)
        .map((niche) => niche?.id);

    return ids;
}
