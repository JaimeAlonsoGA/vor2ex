"use server";

import { revalidatePath } from "next/cache";
import { updateSettings } from "@/services/client/users.client";
import { amazonToConnection } from "@/lib/factories/amazon/amzon-connection";
import { createCookieAction } from "@/lib/actions/cookies-actions";

export async function updateUserSettingsAction(formData: FormData) {
    const name = formData.get("name") as string;
    const language = formData.get("language") as string;
    const amazon_marketplace = formData.get("amazon_marketplace") as string;

    await updateSettings({ name, language, amazon_marketplace });

    await createCookieAction("amazon_connection", JSON.stringify(amazonToConnection(amazon_marketplace)));

    revalidatePath("/settings");
}