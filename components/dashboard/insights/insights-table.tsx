import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart2, Component, Search } from "lucide-react";
import { Niche } from "@/types/niche";
import { Strategy } from "@/types/strategies";
import { getProfitScoreWithStrategy } from "@/lib/functions/strategies/calculate-score";
import { getIconComponent } from "@/components/helpers";
import { cn } from "@/lib/utils";
import { getBorderClass } from "@/lib/functions/strategies/utils";
import SaveNicheButton from "../save-niche-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GoTo from "../ui/go-to";

const TABLE_METRICS: {
    key: keyof Niche;
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

function isValueAlignedWithStrategy(
    metricKey: string,
    niche: Niche,
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

interface AnalyticsTableProps {
    niches: Niche[];
    strategies: Strategy[];
};

export function SavedNichestable({
    niches,
    strategies,
}: AnalyticsTableProps) {
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
                        {niches.map((niche) => {
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
                                        <TableCell key={strategy.id + "-score"} className="text-center align-middle">
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
                                        <GoTo route={`/insights/${niche.id}`} Icon={Component} />
                                        <GoTo route={`/explorer?keyword=${niche.keyword}`} Icon={Search} />
                                        <SaveNicheButton variant="short" term={niche.keyword} savedNiches={niches.map(n => n.keyword)} />
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