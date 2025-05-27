"use server"

import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

export async function getAnalyticIdByKeyword(keyword: string): Promise<Tables<'analytics'>['id']> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("analytics")
        .select("id")
        .eq("keyword", keyword)
        .single();

    if (error) {
        throw new Error(`Error fetching analytics ID by keyword: ${error.message}`);
    }

    if (!data) {
        throw new Error(`No analytics data found for keyword: ${keyword}`);
    }

    return data.id;
}

export async function getAnalyticDataById(id: string): Promise<Tables<'analytics'> | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(`Error fetching analytics data: ${error.message}`);
    }

    return data;
}

export async function getAnalyticsIdsByIds(ids: string[]): Promise<Tables<'analytics'>['id'][]> {
    if (!ids.length) throw new Error("No IDs provided");

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("analytics")
        .select("id")
        .in("id", ids);

    if (error) {
        throw new Error(`Error fetching analytics IDs: ${error.message}`);
    }

    return data.map(item => item.id);
}

export async function getAnalyticsKeywordByIds(ids: string[]): Promise<Tables<'analytics'>['id'][]> {
    if (!ids.length) throw new Error("No IDs provided");

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("analytics")
        .select("keyword")
        .in("id", ids);

    if (error) {
        throw new Error(`Error fetching analytics keywords: ${error.message}`);
    }

    return data.map(item => item.keyword);
}

export async function getAnalyticsDataByIds(ids: string[]): Promise<Tables<'analytics'>[]> {
    if (!ids.length) throw new Error("No IDs provided");

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .in("id", ids);

    if (error) {
        throw new Error(`Error fetching analytics data: ${error.message}`);
    }

    if (!data || data.length === 0) {
        throw new Error("No analytics data found for the provided IDs");
    }

    return data;
}

export async function getAllAnalyticsData(): Promise<Tables<'analytics'>[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("analytics")
        .select("*");

    if (error) {
        throw new Error(`Error fetching all analytics data: ${error.message}`);
    }

    return data;
}