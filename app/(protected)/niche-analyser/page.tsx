import { NicheSearcherDashboard } from "@/components/dashboard/niche-analyser/dashboard";
import AnalyticsFallback from "@/components/dashboard/niche-analyser/fallback";
import { NoStrategiesActivatedFallback } from "@/components/dashboard/strategies/fallback";
import { collectUserAnalyticsData } from "@/lib/functions/analytics/collect-analytics-data";
import { collectUserStrategiesData } from "@/lib/functions/strategies/collect-strategies-data";
import { Suspense } from "react";

export default async function ProtectedPage() {
    const userAnalytics = await collectUserAnalyticsData();
    const userStrategies = (await collectUserStrategiesData()).filter((strategy) => strategy.selected);
    if (!userAnalytics || userAnalytics.length === 0) {
        return <AnalyticsFallback />;
    }
    if (!userStrategies || userStrategies.length === 0) {
        return <NoStrategiesActivatedFallback />;
    }
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <NicheSearcherDashboard analytics={userAnalytics} strategies={userStrategies} />
        </Suspense>
    );
}