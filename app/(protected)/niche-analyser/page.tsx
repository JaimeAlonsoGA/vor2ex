import { NicheSearcherDashboard } from "@/components/dashboard/niche-analyser/dashboard";
import AnalyticsFallback from "@/components/dashboard/niche-analyser/fallback";
import { ModulesCard } from "@/components/modules-cards";
import { collectAnalyticsData } from "@/lib/functions/analytics/collect-analytics-data";
import { Suspense } from "react";

export default async function ProtectedPage() {
    const userAnalytics = await collectAnalyticsData();
    if (!userAnalytics || userAnalytics.length === 0) {
        return <AnalyticsFallback />;
    }
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <NicheSearcherDashboard analytics={userAnalytics ?? []} />
        </Suspense>
    );
}