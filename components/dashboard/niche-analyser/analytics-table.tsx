import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NicheAnalytics } from "@/types/analytics/analytics";
import { BarChart2, Package, Star, Tag, Users } from "lucide-react";
import { Strategy } from "@/types/analytics/strategies";

const TABLE_METRICS: {
    key: keyof NicheAnalytics;
    label: string;
    icon?: React.ReactNode;
    format?: (v: any) => string;
    tooltip?: string;
}[] = [
        {
            key: "avgAmazonRating",
            label: "Avg Rating",
            // icon: <Star className="w-4 h-4 text-yellow-400" />,
            format: (v: number) => v !== undefined ? v.toFixed(2) : "-",
        },
        {
            key: "avgAmazonPrice",
            label: "Avg Price",
            // icon: <Tag className="w-4 h-4 text-blue-300" />,
            format: (v: number) => v !== undefined ? `$${v.toFixed(2)}` : "-",
        },
        {
            key: "totalAmazonReviews",
            label: "Reviews",
            // icon: <Users className="w-4 h-4 text-green-400" />,
            format: (v: number) => v?.toLocaleString() ?? "-",
        },
        {
            key: "totalAmazonSalesVolume",
            label: "Sales Volume",
            // icon: <Package className="w-4 h-4 text-orange-400" />,
            format: (v: number) => v?.toLocaleString() ?? "-",
        },
        {
            key: "uniqueAmazonBrands",
            label: "Brands",
            // icon: <BarChart2 className="w-4 h-4 text-purple-400" />,
        },
    ];

function formatValue(metric: typeof TABLE_METRICS[number], value: any) {
    if (metric.format) return metric.format(value);
    if (typeof value === "number") return value.toLocaleString();
    return value ?? "-";
}

export function AnalyticsTable({ analytics, strategies }: { analytics: NicheAnalytics[], strategies?: Strategy[] }) {
    const maxSales = Math.max(...analytics.map(a => a.totalAmazonSalesVolume ?? 0), 1);

    return (
        <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-400" /> Compare Niches
            </h2>
            <ScrollArea className="w-full overflow-x-auto rounded-lg border bg-background">
                <table className="min-w-full border-separate border-spacing-y-1">
                    <thead>
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground p-2">Keyword</th>
                            {TABLE_METRICS.map((metric) => (
                                <th key={metric.key} className="text-left text-xs font-semibold text-muted-foreground p-2">
                                    <div className="flex items-center gap-1">
                                        {metric.icon}
                                        {metric.label}
                                    </div>
                                </th>
                            ))}
                            <th className="text-left text-xs font-semibold text-muted-foreground p-2">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analytics
                            .map(a => {
                                const { ratingScore, priceScore, reviewsScore, sales } = getProfitScore(a);
                                const salesScore = Math.min(1, (sales ?? 0) / maxSales);
                                const score = salesScore * 0.4 + ratingScore * 0.2 + priceScore * 0.2 + reviewsScore * 0.2;
                                return { ...a, score };
                            })
                            .sort((a, b) => b.score - a.score)
                            .map((niche) => (
                                <tr key={niche.keyword} className="hover:bg-muted transition">
                                    <td className="p-2">
                                        <Badge className="bg-muted text-foreground px-2 py-1 text-xs font-semibold">
                                            {niche.keyword}
                                        </Badge>
                                        {niche.topCategory && (
                                            <span className="ml-2 text-xs text-blue-400">{niche.topCategory}</span>
                                        )}
                                    </td>
                                    {TABLE_METRICS.map((metric) => (
                                        <td key={metric.key} className="p-2 text-sm">
                                            {formatValue(metric, niche[metric.key])}
                                        </td>
                                    ))}
                                    <td className="p-2 text-sm font-bold text-green-500">{(niche.score * 100).toFixed(0)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </ScrollArea>
        </section>
    )
}