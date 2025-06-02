import { strategyToDb } from "@/lib/factories/strategy-item";
import { Strategy } from "@/types/strategies";
import { createClient } from "@/utils/supabase/client";
import { getSettings } from "../settings.server";
import { Tables } from "@/types/supabase";
import { getUser } from "../auth.server";

export async function upsertStrategy(data: Strategy): Promise<Tables<'strategies'>> {
    const dbData = strategyToDb(data);
    const supabase = createClient();
    const user = await getUser();

    const { data: result, error } = await supabase
        .from("strategies")
        .upsert(
            data.id
                ? { ...dbData, id: data.id, user_id: user.id }
                : { ...dbData, user_id: user.id },
            { onConflict: "id" }
        )
        .select()
        .single();

    if (error) {
        console.error("Error upserting strategy data:", error);
        throw new Error("Error upserting strategy data");
    }

    console.log(
        `Strategy ${data.id ? "updated" : "inserted"}:`,
        dbData.name
    );
    return result;
}

export async function deleteStrategy(data: Strategy): Promise<{ success: boolean; message: string }> {
    if (!data.id) throw new Error("Strategy ID is required for deletion");

    const supabase = createClient();
    const user = await getUser();

    const { error } = await supabase
        .from("strategies")
        .delete()
        .eq("id", data.id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting strategy:", error);
        throw new Error("Error deleting strategy");
    }

    return { success: true, message: "Strategy deleted successfully" };
}

export async function toggleStrategySelection(strategyId: string, selected: boolean): Promise<void> {
    const supabase = createClient();
    const user = await getUser();

    const { error } = await supabase
        .from("strategies")
        .update({ selected })
        .eq("id", strategyId)
        .eq("user_id", user.id);

    if (error) throw new Error(`Error updating strategy selection: ${error.message}`);
}