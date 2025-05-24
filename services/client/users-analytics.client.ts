"use client";

import { getUserData } from "../users.service";
import { createClient } from "@/utils/supabase/client";
import { getAnalyticIdByKeyword } from "../analytics.service";

export async function deleteUserAnalyticByKeyword(keyword: string): Promise<{ success: boolean }> {
    const supabase = createClient();
    const user = await getUserData();
    const id = await getAnalyticIdByKeyword(keyword);

    if (!user) {
        throw new Error("User not authenticated");
    }

    if (!id) {
        throw new Error("Analytics not found for the given keyword");
    }

    const { error } = await supabase
        .from("saved_analytics")
        .delete()
        .eq("user_id", user.id)
        .eq("analytic_id", id);

    if (error) {
        throw new Error("Error deleting user analytics");
    } else {
        console.log("User analytics deleted successfully for user:", user.name, "and keyword:", keyword);
        return { success: true };
    }
}

