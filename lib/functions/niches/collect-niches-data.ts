import { dbToNiche } from "@/lib/factories/niche-item";
import { getAllNicheData } from "@/services/niches.server";
import { getUserNichesData } from "@/services/users-niches.server";
import { Niche } from "@/types/analytics/analytics";

export async function collectUserNichesData(): Promise<Niche[]> {
    const userAnalytics = await getUserNichesData();
    if (!userAnalytics || userAnalytics.length === 0) {
        return [];
    }
    const dbAnalytics = userAnalytics.map(dbToNiche);
    return dbAnalytics;
}

export async function collectAllNichesData(): Promise<Niche[]> {
    const userAnalytics = await getAllNicheData();
    if (!userAnalytics || userAnalytics.length === 0) {
        return [];
    }
    const dbAnalytics = userAnalytics.map(dbToNiche);
    return dbAnalytics;
}
