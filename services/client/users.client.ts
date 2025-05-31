import { createClient } from "@/utils/supabase/client";
import { getUser } from "../auth.server";
import { clearAmazonCredentials } from "../credentials.server";

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

    const { error: credentialsError } = await supabase
        .from("credentials")
        .update({
            amz_access_token: null,
            amz_refresh_token: null,
            amz_expires_at: null,
        })
        .eq("user_id", user.id);

    if (credentialsError) throw new Error("Error clearing Amazon credentials");

    console.log("Settings updated successfully:", cleanData);

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