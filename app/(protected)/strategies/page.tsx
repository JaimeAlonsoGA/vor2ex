import StrategiesDashboard from "@/components/dashboard/strategies/dashboard"
import { NoStrategiesCreatedFallback } from "@/components/dashboard/strategies/fallback";
import { collectUserStrategiesData } from "@/lib/functions/strategies/collect-strategies-data";
import { Suspense } from "react"

export default async function ProtectedPage() {
    const userStrategies = await collectUserStrategiesData();
    if (!userStrategies || userStrategies.length === 0) {
        return <NoStrategiesCreatedFallback />;
    }
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <StrategiesDashboard strategies={userStrategies} />
        </Suspense>
    )
}