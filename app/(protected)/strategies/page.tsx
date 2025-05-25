import StrategiesDashboard from "@/components/dashboard/strategies/dashboard"
import { collectUserStrategiesData } from "@/lib/functions/analytics/collect-strategies-data";
import { Suspense } from "react"

export default async function ProtectedPage() {
    const userStrategies = await collectUserStrategiesData();

    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <StrategiesDashboard userStrategies={userStrategies} />
        </Suspense>
    )
}