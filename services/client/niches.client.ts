import { Niche } from "@/types/analytics/analytics";
import { nicheToDb } from "@/lib/factories/niche-item";
import { createClient } from "@/utils/supabase/client";

export async function upsertNiche(data: Niche): Promise<{ success: boolean; message: string }> {
    const dbData = nicheToDb(data);
    const supabase = createClient();

    const { error } = await supabase
        .from("niches")
        .upsert(dbData, { onConflict: "keyword" });

    if (error) {
        console.error("Error upserting niches data:", error);
        return { success: false, message: "Error upserting niches data" };
    }

    console.log("Niches data upserted for keyword:", dbData.keyword);
    return { success: true, message: "Niches data upserted successfully" };
}