"use client";

import { NicheAnalytics } from "@/types/analytics/analytics";
import React, { useState } from "react";
import { Note } from "@/components/note";
import { TopNichesAnalytics } from "./top-niches";
import { Strategy } from "@/types/analytics/strategies";
import { AnalyticsTable } from "./analytics-table";
import NicheQuickOverview from "../analytics/quick-overview";
import { Button } from "@/components/ui/button";
import NicheQuickOverviewSimple from "../analytics/complete-analytics";
import { AnalyticsMetrics } from "./metrics";


export function NicheSearcherDashboard({
    analytics,
    strategies,
}: { analytics: NicheAnalytics[], strategies: Strategy[] }) {
    const [selectedAnalytics, setSelectedAnalytics] = useState<NicheAnalytics | undefined>(undefined);

    function handleSelectAnalytics(niche?: NicheAnalytics) {
        if (!niche) {
            setSelectedAnalytics(undefined);
        } else {
            setSelectedAnalytics(niche);
        }
    }

    return (
        <div className="space-y-6">
            <Note note="Save niches on the Product Searcher to compare them in bulk here" to="/product-searcher" toMessage="Product Searcher" />
            {selectedAnalytics ? (
                <NicheQuickOverviewSimple goBack={handleSelectAnalytics} analytics={selectedAnalytics} isLoading={false} goBackMessage="Back to all niches"/>
            ) : (
                <>
                    <TopNichesAnalytics
                        selectedNiche={selectedAnalytics}
                        onSelectAnalytics={handleSelectAnalytics}
                        analytics={analytics}
                        strategies={strategies}
                    />
                    <AnalyticsTable
                        selectedNiche={selectedAnalytics}
                        onSelectAnalytics={handleSelectAnalytics}
                        analytics={analytics}
                        strategies={strategies}
                    />
                    {/* <AnalyticsMetrics analytics={analytics} strategies={selectedAnalytics ? [selectedAnalytics] : strategies} /> */}
                </>
            )}
        </div>
    );
}