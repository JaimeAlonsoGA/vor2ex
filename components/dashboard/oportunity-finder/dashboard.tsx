"use client";

import { useState, useMemo, useRef } from "react";
import { NicheAnalytics } from "@/types/analytics/analytics";
import { Strategy } from "@/types/analytics/strategies";
import { getProfitScoreWithStrategy } from "@/lib/functions/strategies/calculate-score";
import { getIconComponent } from "@/components/helpers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, Tag, Users, Package, Search, Check, SquarePen, Bookmark, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBorderClass } from "@/lib/functions/strategies/utils";
import { collectAllAnalyticsData } from "@/lib/functions/analytics/collect-analytics-data";
import { useTableListener } from "@/hooks/use-listener";
import { toast } from "sonner";
import { deleteUserAnalyticByKeyword } from "@/services/client/users-analytics.client";
import { saveAnalytics } from "@/services/client/analytics.client";
import NicheQuickOverviewSimple from "../analytics/complete-analytics";
import { useRouter } from "next/navigation";
import { dbToAnalytics } from "@/lib/factories/analytics";
import { Tables } from "@/types/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OpportunityCardProps = {
    niche: NicheAnalytics;
    strategy: Strategy;
    score: number;
    isUserNiche: boolean
    loading?: boolean;
    onSelectAnalytics: (niche: NicheAnalytics) => void;
    onSave: (keyword?: string) => void;
};

function OpportunityCard({ niche, strategy, score, onSelectAnalytics, isUserNiche, loading, onSave }: OpportunityCardProps) {
    return (
        <Card
            className={cn(
                "hover:bg-muted/20 flex flex-row items-center gap-4 p-6 transition-all duration-500",
            )}
        >
            <div className="flex flex-col items-center justify-center gap-2">
                <div className={cn("border", getBorderClass(strategy.color), "p-2 rounded-full")}>
                    {getIconComponent(strategy.icon, "w-6 h-6 text-primary")}
                </div>
                <Badge variant="outline">{strategy.name}</Badge>
            </div>
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{niche.keyword}</span>
                    {niche.topCategory && (
                        <span className="text-xs text-blue-500">{niche.topCategory}</span>
                    )}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {niche.avgAmazonRating?.toFixed(2) ?? "-"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4 text-blue-400" />
                        {niche.avgAmazonPrice !== undefined ? `$${niche.avgAmazonPrice.toFixed(2)}` : "-"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-green-400" />
                        {niche.avgAmazonReviews?.toLocaleString() ?? "-"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-orange-400" />
                        {niche.totalAmazonSalesVolume?.toLocaleString() ?? "-"}
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-end min-w-[70px]">
                <span className={cn(
                    "font-bold text-lg",
                    score >= 70 ? "text-green-600" : score >= 40 ? "text-yellow-500" : "text-red-500"
                )}>
                    {score}
                </span>
                <span className="text-xs text-muted-foreground">Score</span>
            </div>
            <Button
                size="sm"
                variant="secondary"
                onClick={() => onSelectAnalytics(niche)}
                aria-label={`Show analytics for ${niche.keyword}`}
            >
                Analytics
            </Button>
            <Button
                size="sm"
                className="hover:border-primary"
                variant="outline"
                disabled={loading}
                onClick={() => onSave(niche.keyword)}
                aria-label={`Show analytics for ${niche.keyword}`}
            >
                <Bookmark className={`ml-1 ${isUserNiche ? "fill-muted-foreground" : "fill-none"} text-muted-foreground`} />
                {isUserNiche ? "Forget" : "Save"}
            </Button>
        </Card>
    );
}

export function OpportunityFinderDashboard({
    allNiches,
    strategies,
    userNiches
}: { allNiches: NicheAnalytics[], strategies: Strategy[], userNiches: NicheAnalytics[] }) {
    const [search, setSearch] = useState("");
    const [minScore, setMinScore] = useState<number>(70);
    const [editing, setEditing] = useState<boolean>(false);
    const [selectedAnalytics, setSelectedAnalytics] = useState<NicheAnalytics | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<NicheAnalytics[]>(allNiches);
    const [updatedUserNiches, setUpdatedUserNiches] = useState<NicheAnalytics[]>(userNiches);
    const [orderBy, setOrderBy] = useState<"score" | "recent">("score");

    const handleSaveNiche = async (keyword?: string) => {
        if (!keyword) return;
        setLoading(true);

        if (updatedUserNiches.some(niche => niche.keyword === keyword)) {
            toast.promise(
                deleteUserAnalyticByKeyword(keyword).then(res => {
                    setUpdatedUserNiches(prev => prev.filter(niche => niche.keyword !== keyword));
                    setLoading(false);
                    return res;
                }),
                {
                    loading: "Removing...",
                    success: "Niche forgotten",
                    error: "Error removing niche",
                }
            );
        } else {
            // Si no está guardado, añade el nicho
            toast.promise(
                saveAnalytics(keyword).then(res => {
                    // Busca el nicho en data y lo añade a updatedUserNiches
                    const newNiche = data.find(niche => niche.keyword === keyword);
                    if (newNiche) {
                        setUpdatedUserNiches(prev => [...prev, newNiche]);
                    }
                    setLoading(false);
                    return res;
                }),
                {
                    loading: "Saving...",
                    success: "Niche saved",
                    error: "Error saving niche",
                }
            );
        }
    };

    function handleSelectAnalytics(niche?: NicheAnalytics) {
        if (!niche) {
            setSelectedAnalytics(undefined);
        } else {
            setSelectedAnalytics(niche);
        }
    }

    const handleInsert = (newRow: Tables<'analytics'>) => {
        const niche = dbToAnalytics(newRow);
        setData((prevData) => [niche, ...prevData]);
    };

    useTableListener({
        table: "analytics",
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
                                isUserNiche={updatedUserNiches.some(userNiche => userNiche.keyword === niche.keyword)}
                                loading={loading}
                                onSave={handleSaveNiche}
                            />))}
                    </section>
                </>
            )}
        </div>
    );
}