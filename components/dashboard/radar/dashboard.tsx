"use client";

import { useState } from "react";
import { Niche } from "@/types/niche";
import { Strategy } from "@/types/strategies";
import { getProfitScoreWithStrategy } from "@/lib/functions/strategies/calculate-score";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Check, SquarePen, Bookmark, Component } from "lucide-react";
import { useTableListener } from "@/hooks/use-listener";
import NicheQuickOverviewSimple from "../analytics/complete-analytics";
import { dbToNiche } from "@/lib/factories/niche-item";
import { Tables } from "@/types/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OpportunityCard from "./card";

export function OpportunityFinderDashboard({
    niches,
    strategies,
    userNiches
}: { niches: Niche[], strategies: Strategy[], userNiches: Niche[] }) {
    const [search, setSearch] = useState("");
    const [minScore, setMinScore] = useState<number>(70);
    const [editing, setEditing] = useState<boolean>(false);
    const [selectedAnalytics, setSelectedAnalytics] = useState<Niche | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<Niche[]>(niches);
    const [orderBy, setOrderBy] = useState<"score" | "recent">("score");

    function handleSelectAnalytics(niche?: Niche) {
        if (!niche) {
            setSelectedAnalytics(undefined);
        } else {
            setSelectedAnalytics(niche);
        }
    }

    const handleInsert = (newRow: Tables<'niches'>) => {
        const niche = dbToNiche(newRow);
        setData((prevData) => [niche, ...prevData]);
    };

    useTableListener({
        table: "niches",
        onInsert: handleInsert,
    });

    const opportunities = data
        .map(niche => {
            let bestScore = -Infinity;
            let bestStrategy = strategies[0];
            for (const strategy of strategies) {
                const { ratingScore, priceScore, salesScore, reviewsScore } = getProfitScoreWithStrategy(niche, strategy);
                const score =
                    (strategy.salesWeight ?? 0.4) * salesScore +
                    (strategy.ratingWeight ?? 0.2) * ratingScore +
                    (strategy.priceWeight ?? 0.2) * priceScore +
                    (strategy.reviewsWeight ?? 0.2) * reviewsScore;
                if (score > bestScore) {
                    bestScore = score;
                    bestStrategy = strategy;
                }
            }
            return {
                niche,
                strategy: bestStrategy,
                score: Math.round(bestScore * 100),
            };
        })
        .filter(({ score }) => score >= minScore)
        .filter(({ niche }) =>
            !search ||
            niche.keyword.toLowerCase().includes(search.toLowerCase()) ||
            (niche.topCategory?.toLowerCase().includes(search.toLowerCase()))
        )
        .sort((a, b) => {
            if (orderBy === "score") {
                return b.score - a.score;
            } else {
                // Por recientes: compara created_at (debe estar en niche)
                const dateA = new Date(a.niche.searchedAt ?? 0).getTime();
                const dateB = new Date(b.niche.searchedAt ?? 0).getTime();
                return dateB - dateA;
            }
        });

    return (
        <div className="space-y-6">
            {selectedAnalytics ? (
                <NicheQuickOverviewSimple goBack={handleSelectAnalytics} analytics={selectedAnalytics} isLoading={false} goBackMessage="Back to Opportunity finder" />
            ) : (
                <>
                    <div className="flex flex-row justify-between">
                        <div className="flex items-center gap-2 w-full md:w-80">
                            <Input
                                type="search"
                                placeholder="Search keyword or category..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full"
                                aria-label="Search opportunities"
                            />
                            <Button variant="outline" className="px-3" tabIndex={-1}>
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-row items-center gap-2 relative">
                            <div className="flex items-center gap-2">
                                <Select value={orderBy} onValueChange={v => setOrderBy(v as "score" | "recent")}>
                                    <SelectTrigger className="">
                                        <SelectValue>
                                            {orderBy === "score" ? "Score" : "Most Recent"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="score">Score</SelectItem>
                                        <SelectItem value="recent">Most Recent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="relative flex flex-row">
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    step={5}
                                    value={minScore}
                                    onChange={e => setMinScore(Number(e.target.value))}
                                    className={editing ? "w-20 pr-8" : "w-20 pr-8 bg-muted cursor-pointer"}
                                    aria-label="Minimum score"
                                    readOnly={!editing}
                                    onBlur={() => setEditing(false)}
                                    onClick={() => !editing && setEditing(true)}
                                    disabled={!editing}
                                />
                                <button
                                    type="button"
                                    className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                                    tabIndex={-1}
                                    aria-label="Edit minimum score"
                                    onClick={() => setEditing(!editing)}
                                >
                                    {editing ? <Check className="w-4 h-4" /> : <SquarePen className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <section className="grid gap-4 max-h-[500px] overflow-y-auto scrollbar-y-none">
                        {opportunities.length === 0 && (
                            <div className="text-center text-muted-foreground py-12">
                                No opportunities found for your strategies.
                            </div>
                        )}
                        {opportunities.map(({ niche, strategy, score }) => (
                            <OpportunityCard
                                key={niche.keyword + strategy.id}
                                niche={niche}
                                strategy={strategy}
                                score={score}
                                onSelectAnalytics={handleSelectAnalytics}
                                userNiches={userNiches}
                            />
                        ))}
                    </section>
                </>
            )}
        </div>
    );
}