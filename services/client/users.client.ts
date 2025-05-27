import { createClient } from "@/utils/supabase/client";

export async function updateUserProfile(profileData: {
    name: string;
    amazon_marketplace: string;
    language: string;
}) {
    const supabase = createClient();
    // Obtén el usuario autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw userError || new Error("No authenticated user");

    // Sanea los datos antes de actualizar
    const cleanData = {
        name: profileData.name.trim(),
        amazon_marketplace: profileData.amazon_marketplace.trim(),
        language: profileData.language.trim().toLowerCase(),
    };

    const { error, data } = await supabase
        .from("users")
        .update(cleanData)
        .eq("auth_id", user.id)
        .select()
        .single();

    if (error) throw error;
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