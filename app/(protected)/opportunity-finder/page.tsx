import { OpportunityFinderDashboard } from "@/components/dashboard/oportunity-finder/dashboard";
import { NoStrategiesActivatedFallback } from "@/components/dashboard/strategies/fallback";
import { collectAllNichesData, collectUserNichesData } from "@/lib/functions/niches/collect-niches-data";
import { collectUserStrategiesData } from "@/lib/functions/strategies/collect-strategies-data";
import { Suspense } from "react";

export default async function ProtectedPage() {
    const allAnalytics = await collectAllNichesData();
    const userAnalytics = await collectUserNichesData();
    const userStrategies = await collectUserStrategiesData();

    if (!allAnalytics || allAnalytics.length === 0) {
        return <div className="text-center">Couldn't connect with data providers</div>;
    }

    if (!userStrategies || userStrategies.length === 0) {
        return <NoStrategiesActivatedFallback />;
    }

    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <OpportunityFinderDashboard
                allNiches={allAnalytics}
                strategies={userStrategies}
                userNiches={userAnalytics}
            />
        </Suspense>
    );
}