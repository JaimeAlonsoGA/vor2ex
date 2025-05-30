import { createClient } from "@/utils/supabase/client";
import { getUser } from "../auth.server";

export async function updateSettings(profileData: {
    name: string;
    amazon_marketplace: string;
    language: string;
}) {
    const supabase = createClient();
    const user = await getUser();

    const cleanData = {
        name: profileData.name.trim(),
        amazon_marketplace: profileData.amazon_marketplace.trim(),
        language: profileData.language.trim().toLowerCase(),
    };

    const { error, data } = await supabase
        .from("settings")
        .update(cleanData)
        .eq("auth_id", user.id)
        .select()
        .single();

    if (error) throw new Error("Error updating settings");

    return data;
}

export async function sendPasswordReset(email: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
    return true;
}