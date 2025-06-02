import { SavedNichesDashboard } from "@/components/dashboard/niche-analyser/dashboard";
import SavedNichesFallback from "@/components/dashboard/niche-analyser/fallback";
import { NoStrategiesActivatedFallback } from "@/components/dashboard/strategies/fallback";
import { getUserNichesAction } from "@/lib/actions/niches-actions";
import { getStrategiesAction } from "@/lib/actions/strategies-actions";
import { Suspense } from "react";

export default async function ProtectedPage() {
    const niches = await getUserNichesAction();
    const strategies = (await getStrategiesAction()).filter((strategy) => strategy.selected);

    if (!niches || niches.length === 0) {
        return <SavedNichesFallback />;
    }
    if (!strategies || strategies.length === 0) {
        return <NoStrategiesActivatedFallback />;
    }
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <SavedNichesDashboard niches={niches} strategies={strategies} />
        </Suspense>
    );
}