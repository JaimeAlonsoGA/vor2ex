import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { getUserData } from "./users.server";

export async function getUserStrategies(): Promise<Tables<'strategies'>[]> {
    const supabase = await createClient();
    const user = await getUserData();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
        .from("strategies")
        .select("*")
        .eq("user_id", user.id);

    if (error) {
        throw new Error(`Error fetching user strategies: ${error.message}`);
    }

    return data;
}
