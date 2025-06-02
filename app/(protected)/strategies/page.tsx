import StrategiesDashboard from "@/components/dashboard/strategies/dashboard"
import { NoStrategiesCreatedFallback } from "@/components/dashboard/strategies/fallback";
import { getStrategiesAction } from "@/lib/actions/strategies-actions";
import { Suspense } from "react"

export default async function ProtectedPage() {
    const userStrategies = await getStrategiesAction();
    if (!userStrategies || userStrategies.length === 0) {
        return <NoStrategiesCreatedFallback />;
    }
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <StrategiesDashboard strategies={userStrategies} />
        </Suspense>
    )
}