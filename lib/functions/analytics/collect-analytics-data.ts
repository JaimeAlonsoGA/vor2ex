import { dbToAnalytics } from "@/lib/factories/analytics";
import { getUserAnalyticsData } from "@/services/users-analytics.service";
import { NicheAnalytics } from "@/types/niche-analytics";

export async function collectAnalyticsData(): Promise<NicheAnalytics[]> {
    const userAnalytics = await getUserAnalyticsData();
    if (!userAnalytics || userAnalytics.length === 0) {
        return [];
    }
    const dbAnalytics = userAnalytics.map(dbToAnalytics);
    return dbAnalytics;
}
