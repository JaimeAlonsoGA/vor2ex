import SavedNichesFallback from "@/components/dashboard/insights/fallback";
import { SavedNichestable } from "@/components/dashboard/insights/insights-table";
import { TopNichesAnalytics } from "@/components/dashboard/insights/top-niches";
import { NoStrategiesActivatedFallback } from "@/components/dashboard/strategies/fallback";
import { Note } from "@/components/note";
import { getUserNichesAction } from "@/lib/actions/niches-actions";
import { getStrategiesAction } from "@/lib/actions/strategies-actions";

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
        <div className="space-y-6">
            <Note note="Save niches on the Explorer to compare them in bulk here" to="/explorer" toMessage="Explorer" />
            <TopNichesAnalytics
                analytics={niches}
                strategies={strategies}
            />
            <SavedNichestable
                niches={niches}
                strategies={strategies}
            />
        </div>
    );
}