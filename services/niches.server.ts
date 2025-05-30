"use server"

import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

export async function getNicheIdByKeyword(keyword: string): Promise<Tables<'niches'>['id']> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("niches")
        .select("id")
        .eq("keyword", keyword)
        .single();

    if (error) {
        throw new Error(`Error fetching niches ID by keyword: ${error.message}`);
    }

    if (!data) {
        throw new Error(`No niches data found for keyword: ${keyword}`);
    }

    return data.id;
}

export async function getAllNicheData(): Promise<Tables<'niches'>[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("niches")
        .select("*");

    if (error) {
        throw new Error(`Error fetching all analytics data: ${error.message}`);
    }

    return data ?? [];
}