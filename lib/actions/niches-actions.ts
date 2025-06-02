"use server"

import { dbToNiche } from "@/lib/factories/niche-item";
import { getNichesData } from "@/services/niches.server";
import { getSettings } from "@/services/settings.server";
import { getUserNichesData } from "@/services/users-niches.server";
import { Niche } from "@/types/niche";
import { amazonToConnection } from "../factories/amazon/amzon-connection";
import { cookies } from "next/headers";

export async function getUserNichesAction(): Promise<Niche[]> {
    const cookieStore = await cookies();
    const rawConnection = cookieStore.get("amazon_connection")?.value;
    let connection;
    if (rawConnection) {
        connection = JSON.parse(rawConnection);
    } else {
        const settings = await getSettings();
        connection = amazonToConnection(settings.amazon_marketplace);
    }

    const userNiches = await getUserNichesData(connection.domain);

    if (!userNiches || userNiches.length === 0) {
        return [];
    }
    const dbAnalytics = userNiches.map(dbToNiche)
        .filter((niche) => niche.marketplace === connection.domain);

    return dbAnalytics;
}

export async function getNichesAction(): Promise<Niche[]> {
    const cookieStore = await cookies();
    const rawConnection = cookieStore.get("amazon_connection")?.value;

    let connection;
    if (rawConnection) {
        connection = JSON.parse(rawConnection); 
    } else {
        const settings = await getSettings();
        connection = amazonToConnection(settings.amazon_marketplace);
    }

    const niches = await getNichesData(connection.domain);

    if (!niches || niches.length === 0) {
        return [];
    }

    const dbAnalytics = niches.map(dbToNiche);
    return dbAnalytics;
}
