"use server"

import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

export async function getNicheIdByKeyword(keyword: string): Promise<Tables<'niches'>['id']> {
    if (!keyword) throw new Error("No keyword to search niche for");
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

export async function getNichesData(marketplace: string): Promise<Tables<'niches'>[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("niches")
        .select("*")
        .eq("amazon_marketplace", marketplace);

    if (error) {
        throw new Error(`Error fetching all analytics data: ${error.message}`);
    }

    return data ?? [];
}

export async function getNicheByKeyword(keyword: string, marketplace: string): Promise<Tables<'niches'>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("niches")
        .select("*")
        .eq("keyword", keyword)
        .eq("amazon_marketplace", marketplace)
        .single();

    if (error) {
        throw new Error(`Error fetching niche data by keyword: ${error.message}`);
    }

    return data ?? {} as Tables<'niches'>
}

export async function getNicheById(id: string): Promise<Tables<'niches'>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("niches")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(`Error fetching niche data by id: ${error.message}`);
    }

    return data ?? {} as Tables<'niches'>
}