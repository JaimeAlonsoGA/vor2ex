import { getUserAnalyticsIds } from "@/services/users-analytics.service";
import { Suspense } from "react";

export default async function ProtectedPage() {
    const userAnalytics = await getUserAnalyticsIds();
    console.log("User Analytics:", userAnalytics);
    return (
        <div className="flex flex-col gap-12 mx-auto">
            <Suspense fallback={<div className="text-center">Loading...</div>}>
                Niche Analyser
            </Suspense>
        </div>
    );
}