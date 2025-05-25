"use server";

import { createClient } from "@/utils/supabase/server";
import { getUserData } from "./users.server";
import { getAnalyticsDataByIds, getAnalyticsIdsByIds, getAnalyticsKeywordByIds } from "./analytics.server";
import { Tables } from "@/types/supabase";

export async function getUserAnalyticsData(): Promise<Tables<'analytics'>[]> {
    const supabase = await createClient();
    const user = await getUserData();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data: userAnalytics, error } = await supabase
        .from("saved_analytics")
        .select("analytic_id")
        .eq("user_id", user.id);

    if (error) {
        throw new Error("Error fetching user analytics");
    }

    if (!userAnalytics || userAnalytics.length === 0) {
        return [];
    }

    const data = getAnalyticsDataByIds(
        userAnalytics
            .map((item) => item.analytic_id)
            .filter((id): id is string => typeof id === "string" && id !== null)
    );
    return data;
}

export async function getUserAnalyticsKeyword(): Promise<Tables<'analytics'>['keyword'][]> {
    const supabase = await createClient();
    const user = await getUserData();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data: userAnalytics, error } = await supabase
        .from("saved_analytics")
        .select("analytic_id")
        .eq("user_id", user.id);

    if (error) {
        throw new Error("Error fetching user analytics by ID");
    }

    if (userAnalytics.length === 0 || !userAnalytics) {
        console.warn("No user analytics found for the current user.");
        return [];
    }

    const data = getAnalyticsKeywordByIds(
        userAnalytics
            .map((item) => item.analytic_id)
            .filter((id): id is string => typeof id === "string" && id !== null)
    );
    return data;
}


export async function getUserAnalyticsIds(): Promise<Tables<'analytics'>['id'][]> {
    const supabase = await createClient();
    const user = await getUserData();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data: userAnalytics, error } = await supabase
        .from("saved_analytics")
        .select("analytic_id")
        .eq("user_id", user.id);

    if (error) {
        throw new Error("Error fetching user analytics by ID");
    }
    const data = getAnalyticsIdsByIds(
        userAnalytics
            .map((item) => item.analytic_id)
            .filter((id): id is string => typeof id === "string" && id !== null)
    );
    return data;
}
