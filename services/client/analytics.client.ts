import { getAnalyticIdByKeyword } from "../analytics.service";
import { getUserData } from "../users.service";
import { NicheAnalytics } from "@/types/niche-analytics";
import { analyticsToDb } from "@/lib/factories/analytics";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/supabase";

export async function insertAnalytics(data: NicheAnalytics): Promise<{ success: boolean; message: string } | undefined> {
    const dbData = analyticsToDb(data);
    const supabase = createClient();

    const { data: existing, error: selectError } = await supabase
        .from("analytics")
        .select("*")
        .eq("keyword", dbData.keyword)
        .maybeSingle();

    if (selectError) {
        console.error("Error checking existing analytics row:", selectError);
        return { success: false, message: "Error checking existing analytics row" };
    }

    if (existing && existing.id) {
        const { error: updateError } = await supabase
            .from("analytics")
            .update(dbData)
            .eq("id", existing.id);

        if (updateError) {
            console.error("Error updating analytics data:", updateError);
            return { success: false, message: "Error updating analytics data" };
        }
        console.log("Analytics data updated for keyword:", dbData.keyword);
    } else {
        const { error: insertError } = await supabase
            .from("analytics")
            .insert(dbData);

        if (insertError) {
            console.error("Error inserting analytics data:", insertError);
            return { success: false, message: "Error inserting analytics data" };
        }
        console.log("Analytics data inserted for keyword:", dbData.keyword);
        return { success: true, message: "Analytics data inserted successfully" };
    }
}

export async function saveAnalytics(keyword: string): Promise<Tables<"saved_analytics">> {
    const supabase = createClient();
    const user = await getUserData();
    const id = await getAnalyticIdByKeyword(keyword);

    if (!id) {
        throw new Error("Analytics not found for the given keyword");
    }
    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
        .from("saved_analytics")
        .insert({ analytic_id: id, user_id: user.id })
        .select()
        .single();

    if (error) {
        throw new Error(`Error saving analytics data: ${error.message}`);
    }
    console.log("Analytics data saved for user:", user.name);
    return data;
}