import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Niche } from "@/types/analytics/analytics";
import { Strategy } from "@/types/analytics/strategies";
import { getProfitScoreWithStrategy } from "@/lib/functions/strategies/calculate-score";
import { getIconComponent } from "@/components/helpers";
import { Check, HelpCircle, SquarePen, Trophy } from "lucide-react";
import NicheQuickOverview from "../analytics/quick-overview";
import { getBorderClass } from "@/lib/functions/strategies/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TopNichesAnalyticsProps {
    analytics: Niche[];
    strategies: Strategy[];
    onSelectAnalytics: (niche: Niche) => void;
    selectedNiche?: Niche;
}

type TopNiche = {
    niche: Niche;
    strategy: Strategy;
    score: number;
    isNearOptimum: boolean;
};

function isNearOptimum(
    niche: Niche,
    strategy: Strategy,
    threshold = 0.7 // Score gaussiano mínimo para considerar "cerca del óptimo"
) {
    const { ratingScore, priceScore, salesScore } = getProfitScoreWithStrategy(niche, strategy);
    // Considera cerca del óptimo si al menos dos parámetros clave están por encima del threshold
    let count = 0;
    if (ratingScore >= threshold) count++;
    if (priceScore >= threshold) count++;
    if (salesScore !== undefined && salesScore >= threshold) count++;
    return count >= 2;
}

function getTopNiches(
    analytics: Niche[],
    strategies: Strategy[],
    minScore = 70
): TopNiche[] {
    // Para cada nicho, calcula el mejor score y la estrategia que lo produce
    const scored: TopNiche[] = analytics.map((niche) => {
        let bestScore = -Infinity;
        let bestStrategy = strategies[0];
        let nearOptimum = false;
        strategies.forEach((strategy) => {
            const { ratingScore, priceScore, reviewsScore, salesScore } = getProfitScoreWithStrategy(niche, strategy);

            // Score ponderado y normalizado
            const score =
                (strategy.salesWeight ?? 0.4) * salesScore +
                (strategy.ratingWeight ?? 0.2) * ratingScore +
                (strategy.priceWeight ?? 0.2) * priceScore +
                (strategy.reviewsWeight ?? 0.2) * reviewsScore;

            if (score > bestScore) {
                bestScore = score;
                bestStrategy = strategy;
                nearOptimum = isNearOptimum(niche, strategy);
            }
        });
        return { niche, strategy: bestStrategy, score: Math.round(bestScore * 100), isNearOptimum: nearOptimum };
    });

    // Filtra por score mínimo y ordena por score descendente
    return scored
        .filter(n => n.score >= minScore)
        .sort((a, b) => b.score - a.score);
}

export function TopNichesAnalytics({
    analytics,
    strategies,
    onSelectAnalytics,
    selectedNiche,
}: TopNichesAnalyticsProps) {
    const [minScore, setMinScore] = useState<number>(70);
    const [editing, setEditing] = useState<boolean>(false);

    const topNiches = getTopNiches(analytics, strategies, minScore);

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-6 justify-between">
                <div className="text-lg font-semibold flex items-start">
                    <div className="flex flex-row items-center gap-1">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <h2>Top Niches</h2>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                tabIndex={0}
                                aria-label="What is the rating optimum?"
                                className="ml-2 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                            >
                                <HelpCircle className="w-4 h-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent sideOffset={4}>
                            <p>
                                It shows the best performance niches based on the selected strategies.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {topNiches.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-8">
                        No niches found with {minScore} or more score.
                    </div>
                )}
                {topNiches.map(({ niche, strategy, score, isNearOptimum }) => (
                    <Card
                        key={niche.keyword + strategy.id}
                        className={cn(
                            "relative flex flex-col justify-between shadow-lg border-2 transition-all"
                        )}
                    >
                        <CardHeader>
                            <CardTitle className="flex gap-2 items-center justify-between">
                                <Badge variant="secondary">
                                    {niche.keyword}
                                </Badge>
                                <span className={cn("ml-2 flex items-center gap-1 text-xs font-semibold rounded-full border p-2",
                                    getBorderClass(strategy.color),)}>
                                    {getIconComponent(strategy.icon, `w-4 h-4`)}
                                </span>
                            </CardTitle>
                            <CardDescription>
                                {niche.topCategory && (
                                    <span className="text-xs font-medium ml-1 text-blue-400">
                                        {niche.topCategory}
                                    </span>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <div className="flex flex-wrap gap-3 text-xs">
                                <span>
                                    <span className="font-semibold">Price:</span>{" "}
                                    {niche.avgAmazonPrice !== undefined ? `$${niche.avgAmazonPrice.toFixed(2)}` : "-"}
                                </span>
                                <span>
                                    <span className="font-semibold">Rating:</span>{" "}
                                    {niche.avgAmazonRating?.toFixed(2) ?? "-"}
                                </span>
                                <span>
                                    <span className="font-semibold">Reviews:</span>{" "}
                                    {niche.totalAmazonReviews?.toLocaleString() ?? "-"}
                                </span>
                                <span>
                                    <span className="font-semibold">Sales:</span>{" "}
                                    {niche.totalAmazonSalesVolume?.toLocaleString() ?? "-"}
                                </span>
                                <span>
                                    <span className="font-semibold">Score:</span>{" "}
                                    <span className="font-bold text-green-500">{score}</span>
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant={selectedNiche?.keyword === niche.keyword ? "default" : "outline"}
                                className="w-full mt-2"
                                onClick={() => onSelectAnalytics(niche)}
                                aria-expanded={selectedNiche?.keyword === niche.keyword}
                                aria-controls={`quick-overview-${niche.keyword}`}
                            >
                                {selectedNiche?.keyword === niche.keyword ? "Hide analytics" : "View analytics"}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section >
    );
}