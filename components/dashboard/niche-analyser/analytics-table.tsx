import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart2, Package, Star, Tag, Users, CheckCircle2, Bookmark, ChartColumnIncreasing } from "lucide-react";
import { NicheAnalytics } from "@/types/analytics/analytics";
import { Strategy } from "@/types/analytics/strategies";
import { getProfitScoreWithStrategy } from "@/lib/functions/strategies/calculate-score";
import { getIconComponent } from "@/components/helpers";
import { cn } from "@/lib/utils";
import { getBorderClass } from "@/lib/functions/strategies/utils";
import { deleteUserAnalyticByKeyword } from "@/services/client/users-analytics.client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const TABLE_METRICS: {
    key: keyof NicheAnalytics;
    label: string;
    icon?: React.ReactNode;
    format?: (v: any) => string;
}[] = [
        {
            key: "avgAmazonRating",
            label: "Rating",
            format: (v: number) => v !== undefined ? v.toFixed(2) : "-",
        },
        {
            key: "avgAmazonPrice",
            label: "Price",
            format: (v: number) => v !== undefined ? `$${v.toFixed(2)}` : "-",
        },
        {
            key: "avgAmazonReviews",
            label: "Reviews",
            format: (v: number) => v?.toLocaleString() ?? "-",
        },
        {
            key: "totalAmazonSalesVolume",
            label: "Sales Volume",
            format: (v: number) => v?.toLocaleString() ?? "-",
        },
    ];

function formatValue(metric: typeof TABLE_METRICS[number], value: any) {
    if (metric.format) return metric.format(value);
    if (typeof value === "number") return value.toLocaleString();
    return value ?? "-";
}

type AnalyticsTableProps = {
    analytics: NicheAnalytics[];
    strategies: Strategy[];
    onSelectAnalytics: (niche: NicheAnalytics) => void;
    selectedNiche?: NicheAnalytics;
};

// Lógica para determinar si un valor es afín a la estrategia usando el score gaussiano
function isValueAlignedWithStrategy(
    metricKey: string,
    niche: NicheAnalytics,
    strategy: Strategy
): boolean {
    const { ratingScore, priceScore, reviewsScore, salesScore } = getProfitScoreWithStrategy(niche, strategy);
    switch (metricKey) {
        case "avgAmazonRating":
            return ratingScore >= 0.7;
        case "avgAmazonPrice":
            return priceScore >= 0.7;
        case "avgAmazonReviews": {
            return (niche.avgAmazonReviews ?? Infinity) < strategy.reviewsTop;
        }
        case "totalAmazonSalesVolume":
            return salesScore >= 0.7;
        default:
            return false;
    }
}

export function AnalyticsTable({
    analytics,
    strategies,
    onSelectAnalytics,
}: AnalyticsTableProps) {
    const router = useRouter();

    function handleUnsaveNiche(niche: NicheAnalytics) {
        toast.promise(
            deleteUserAnalyticByKeyword(niche.keyword).then(res => {
                return res;
            }),
            {
                loading: "Removing...",
                success: "Niche forgotten",
                error: "Error removing niche",
            }
        );
        router.refresh();
    }

    return (
        <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-400" /> All Niches Analytics
            </h2>
            <div className="w-full overflow-x-auto rounded-lg border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left text-xs font-semibold text-muted-foreground">Keyword</TableHead>
                            {TABLE_METRICS.map((metric) => (
                                <TableHead key={metric.key} className="text-left text-xs font-semibold text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        {metric.icon}
                                        {metric.label}
                                    </div>
                                </TableHead>
                            ))}
                            {strategies.map((strategy) => (
                                <TableHead key={strategy.id + "-score"} className="text-left text-xs font-semibold text-muted-foreground">
                                    <div className={cn("flex p-1 border rounded-full justify-center items-center", getBorderClass(strategy.color))}>
                                        {getIconComponent(strategy.icon, `w-3 h-3`)}
                                    </div>
                                </TableHead>
                            ))}
                            <TableHead colSpan={2}></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {analytics.map((niche) => {
                            const strategyResults = strategies.map(strategy => {
                                const { ratingScore, priceScore, reviewsScore, salesScore } = getProfitScoreWithStrategy(niche, strategy);
                                const score =
                                    (strategy.salesWeight ?? 0.4) * salesScore +
                                    (strategy.ratingWeight ?? 0.2) * ratingScore +
                                    (strategy.priceWeight ?? 0.2) * priceScore +
                                    (strategy.reviewsWeight ?? 0.2) * reviewsScore;
                                return {
                                    strategy,
                                    score: Math.round(score * 100),
                                };
                            });

                            return (
                                <TableRow key={niche.keyword} className="hover:bg-muted transition">
                                    <TableCell>
                                        <Badge variant={"secondary"}>
                                            {niche.keyword}
                                        </Badge>
                                        {niche.topCategory && (
                                            <span className="ml-2 text-xs text-blue-400">{niche.topCategory}</span>
                                        )}
                                    </TableCell>
                                    {TABLE_METRICS.map((metric) => (
                                        <TableCell key={metric.key} className="text-sm text-foreground">
                                            <span className="flex items-center gap-1">
                                                {formatValue(metric, niche[metric.key])}
                                                {strategies.map((strategy) => {
                                                    const aligned = isValueAlignedWithStrategy(metric.key, niche, strategy);
                                                    return aligned ? (
                                                        <span key={strategy.id} title={`Near optimum for ${strategy.name}`}>
                                                            {getIconComponent(strategy.icon, "w-4 h-4 text-muted-foreground")}
                                                        </span>
                                                    ) : null;
                                                })}
                                            </span>
                                        </TableCell>
                                    ))}
                                    {strategyResults.map(({ strategy, score }) => (
                                        <TableCell key={strategy.id + "-score"}>
                                            <span
                                                className={cn(
                                                    "text-sm",
                                                    {
                                                        "font-bold text-green-500": score >= 70,
                                                        "text-primary": score >= 40 && score < 70,
                                                        "text-red-500": score < 40,
                                                    }
                                                )}>{score}</span>
                                        </TableCell>
                                    ))}
                                    <TableCell className="gap-2 flex items-center">
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
                                            onClick={() => handleUnsaveNiche(niche)}
                                            aria-label={`Show analytics for ${niche.keyword}`}
                                        >
                                            <Bookmark className="ml-1 fill-muted-foreground text-muted-foreground" />
                                            Unsave
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}