import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NicheAnalytics } from "@/types/analytics/analytics";
import { Package, Star, Tag, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/types/analytics/strategies";
import { getProfitScoreWithStrategy } from "@/lib/functions/strategies/calculate-score";

function getTopNiches(analytics: NicheAnalytics[], top = 3, strategies: Strategy[]) {
    const maxSales = Math.max(...analytics.map(a => a.totalAmazonSalesVolume ?? 0), 1);
    return [...analytics]
        .map((a) => {
            const { ratingScore, priceScore, reviewsScore, sales } = getProfitScoreWithStrategy(analytics[0], strategies[0]);
            const salesScore = Math.min(1, (sales ?? 0) / maxSales);
            const score = salesScore * 0.4 + ratingScore * 0.2 + priceScore * 0.2 + reviewsScore * 0.2;
            return { ...a, score, ratingScore, priceScore, reviewsScore, salesScore };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, top);
}

export function TopNichesAnalytics({ analytics, strategies }: { analytics: NicheAnalytics[]; strategies: Strategy[] }) {
    const topNiches = getTopNiches(analytics, 3, strategies);

    return (
        <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Top Niches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topNiches.map((niche, idx) => (
                    <Card
                        key={niche.keyword}
                        className={cn(
                            "flex flex-col justify-between bg-background border shadow-sm hover:shadow-md transition-shadow min-h-[180px]",
                            idx === 0 ? "border-yellow-500" : idx === 1 ? "border-blue-500" : "border-green-500"
                        )}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="flex gap-2">
                                <Badge variant={"secondary"}>
                                    {niche.keyword}
                                </Badge>
                                {niche.topCategory && (
                                    <span className="text-xs font-medium ml-1 text-blue-400">
                                        {niche.topCategory}
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <div className="flex flex-wrap gap-3 mt-2">
                                <div className="flex items-center gap-1 text-xs">
                                    <Star className="w-4 h-4" />
                                    <span
                                        className={cn(
                                            "underline underline-offset-4",
                                            niche.avgAmazonRating && niche.avgAmazonRating >= 2 && niche.avgAmazonRating <= 3
                                                ? "decoration-green-500"
                                                : "decoration-orange-400"
                                        )}
                                    >
                                        {niche.avgAmazonRating?.toFixed(2) ?? "-"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <Tag className="w-4 h-4" />
                                    <span
                                        className={cn(
                                            "underline underline-offset-4",
                                            niche.avgAmazonPrice && niche.avgAmazonPrice >= 15 && niche.avgAmazonPrice <= 40
                                                ? "decoration-green-500"
                                                : "decoration-orange-400"
                                        )}
                                    >
                                        {niche.avgAmazonPrice !== undefined ? `$${niche.avgAmazonPrice.toFixed(2)}` : "-"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <Users className="w-4 h-4" />
                                    <span
                                        className={cn(
                                            "underline underline-offset-4",
                                            (niche.totalAmazonReviews ?? 0) < 300
                                                ? "decoration-green-500"
                                                : (niche.totalAmazonReviews ?? 0) < 500
                                                    ? "decoration-yellow-400"
                                                    : (niche.totalAmazonReviews ?? 0) < 1000
                                                        ? "decoration-orange-400"
                                                        : "decoration-red-400"
                                        )}>
                                        {niche.totalAmazonReviews?.toLocaleString() ?? "-"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <Package className="w-4 h-4" />
                                    <span className="underline underline-offset-4 decoration-blue-400">
                                        {niche.totalAmazonSalesVolume?.toLocaleString() ?? "-"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <span className="text-muted-foreground">Score:</span>
                                    <span className="font-bold text-green-500">{(niche.score * 100).toFixed(0)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}