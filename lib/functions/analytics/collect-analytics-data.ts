import { dbToAnalytics } from "@/lib/factories/analytics";
import { getAllAnalyticsData } from "@/services/analytics.server";
import { getUserAnalyticsData } from "@/services/users-analytics.server";
import { NicheAnalytics } from "@/types/analytics/analytics";

export async function collectUserAnalyticsData(): Promise<NicheAnalytics[]> {
    const userAnalytics = await getUserAnalyticsData();
    if (!userAnalytics || userAnalytics.length === 0) {
        return [];
    }
    const dbAnalytics = userAnalytics.map(dbToAnalytics);
    return dbAnalytics;
}

export async function collectAllAnalyticsData(): Promise<NicheAnalytics[]> {
    const userAnalytics = await getAllAnalyticsData();
    if (!userAnalytics || userAnalytics.length === 0) {
        return [];
    }
    const dbAnalytics = userAnalytics.map(dbToAnalytics);
    return dbAnalytics;
}
