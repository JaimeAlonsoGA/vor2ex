import { Niche } from "@/types/niche";
import { nicheToDb } from "@/lib/factories/niche-item";
import { createClient } from "@/utils/supabase/client";

export async function upsertNiche(data: Niche, marketplace: string): Promise<{ success: boolean; message: string }> {
    const dbData = nicheToDb(data);
    const supabase = createClient();

    const { error } = await supabase
        .from("niches")
        .upsert({ ...dbData, amazon_marketplace: marketplace }, { onConflict: "keyword" });

    if (error) {
        console.error("Error upserting niches data:", error);
        return { success: false, message: "Error upserting niches data" };
    }

    console.log("Niches data upserted for keyword:", dbData.keyword);
    return { success: true, message: "Niches data upserted successfully" };
}