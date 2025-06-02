import { OpportunityFinderDashboard } from "@/components/dashboard/oportunity-finder/dashboard";
import { NoStrategiesActivatedFallback } from "@/components/dashboard/strategies/fallback";
import { getNichesAction, getUserNichesAction } from "@/lib/actions/niches-actions";
import { getStrategiesAction } from "@/lib/actions/strategies-actions";
import { Suspense } from "react";

export default async function ProtectedPage() {
    const niches = await getNichesAction();
    const savedNiches = await getUserNichesAction();
    const strategies = await getStrategiesAction();

    if (!niches || niches.length === 0) {
        return <div className="text-center">Couldn't connect with data providers</div>;
    }

    if (!strategies || strategies.length === 0) {
        return <NoStrategiesActivatedFallback />;
    }

    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <OpportunityFinderDashboard
                niches={niches}
                strategies={strategies}
                userNiches={savedNiches}
            />
        </Suspense>
    );
}