import { OpportunityFinderDashboard } from "@/components/dashboard/radar/dashboard";
import { NoStrategiesActivatedFallback } from "@/components/dashboard/strategies/fallback";
import { Note } from "@/components/note";
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
        <section>
            <Note
                note="Discover new opportunities provided by Vor2ex by defining strategies that fit your business model. Learn more about how to create effective strategies."
                to="/help"
                toMessage="Creating effective strategies"
            />
            <OpportunityFinderDashboard
                niches={niches}
                strategies={strategies}
                userNiches={savedNiches}
            />
        </section>
    );
}