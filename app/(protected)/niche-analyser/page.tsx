import LoadingState from "@/components/ui/loading-state";
import { getUserAnalyticsIds } from "@/services/users-analytics.service";
import { Suspense } from "react";

export default async function ProtectedPage() {
    const userAnalytics = await getUserAnalyticsIds();
    console.log("User Analytics:", userAnalytics);
    return (
        <div className="flex flex-col gap-12 mx-auto">
            <Suspense fallback={<LoadingState />}>
                Niche Analyser
            </Suspense>
        </div>
    );
}