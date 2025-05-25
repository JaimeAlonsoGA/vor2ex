import { strategyToDb } from "@/lib/factories/strategy-item";
import { Strategy } from "@/types/analytics/strategies";
import { createClient } from "@/utils/supabase/client";
import { getUserData } from "../users.server";
import { Tables } from "@/types/supabase";

export async function insertOrUpdateStrategy(data: Strategy): Promise<Tables<'strategies'>> {
    const dbData = strategyToDb(data);
    const supabase = createClient();
    const user = await getUserData();

    if (!user) {
        throw new Error("User not authenticated");
    }

    if (data.id) {
        const { data: updatedData, error: updateError } = await supabase
            .from("strategies")
            .update(dbData)
            .eq("id", data.id)
            .select()
            .single();

        if (updateError) {
            console.error("Error updating strategies data:", updateError);
            throw new Error("Error updating strategies data");
        }
        console.log("Strategies data updated for strategy:", dbData.name);
        return updatedData;

    } else {
        const { data: insertedData, error: insertError } = await supabase
            .from("strategies")
            .insert({ ...dbData, user_id: user.id })
            .select()
            .single();

        if (insertError) {
            console.error("Error inserting strategies data:", insertError);
            throw new Error("Error inserting strategies data");
        }
        console.log("Strategies data inserted for strategy:", dbData.name);
        return insertedData;
    }
}

export async function deleteStrategy(data: Strategy): Promise<{ success: boolean; message: string } | undefined> {
    const supabase = createClient();
    const user = await getUserData();

    if (!user) {
        console.error("User not authenticated");
        return { success: false, message: "User not authenticated" };
    }

    if (data.id) {
        const { error } = await supabase
            .from("strategies")
            .delete()
            .eq("id", data.id)
            .eq("user_id", user.id);

        if (error) {
            console.error("Error deleting strategy:", error);
            return { success: false, message: "Error deleting strategy" };
        }
        console.log("Strategy deleted successfully:", data.name);
        return { success: true, message: "Strategy deleted successfully" };
    } else {
        console.error("No strategy ID provided for deletion");
        return { success: false, message: "No strategy ID provided for deletion" };
    }

}