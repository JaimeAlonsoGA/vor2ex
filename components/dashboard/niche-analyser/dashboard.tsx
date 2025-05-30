"use client";

import { Niche } from "@/types/analytics/analytics";
import React, { useState } from "react";
import { Note } from "@/components/note";
import { TopNichesAnalytics } from "./top-niches";
import { Strategy } from "@/types/analytics/strategies";
import { SavedNichestable } from "./analytics-table";
import NicheQuickOverviewSimple from "../analytics/complete-analytics";

export function SavedNichesDashboard({
    niches,
    strategies,
}: { niches: Niche[], strategies: Strategy[] }) {
    const [selectedNiche, setSelectedNiche] = useState<Niche | undefined>(undefined);

    function handleSelectAnalytics(niche?: Niche) {
        if (!niche) {
            setSelectedNiche(undefined);
        } else {
            setSelectedNiche(niche);
        }
    }

    return (
        <div className="space-y-6">
            <Note note="Save niches on the Product Explorer to compare them in bulk here" to="/explorer" toMessage="Product Explorer" />
            {selectedNiche ? (
                <NicheQuickOverviewSimple goBack={handleSelectAnalytics} analytics={selectedNiche} isLoading={false} goBackMessage="Back to all niches" />
            ) : (
                <>
                    <TopNichesAnalytics
                        selectedNiche={selectedNiche}
                        onSelectAnalytics={handleSelectAnalytics}
                        analytics={niches}
                        strategies={strategies}
                    />
                    <SavedNichestable
                        selectedNiche={selectedNiche}
                        onSelectAnalytics={handleSelectAnalytics}
                        niches={niches}
                        strategies={strategies}
                    />
                    {/* <AnalyticsMetrics analytics={analytics} strategies={selectedAnalytics ? [selectedAnalytics] : strategies} /> */}
                </>
            )}
        </div>
    );
}