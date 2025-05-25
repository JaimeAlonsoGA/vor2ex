import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NicheAnalytics } from "@/types/analytics/analytics";
import { Strategy } from "@/types/analytics/strategies";
import { Badge, Package, Star, Tag, TrendingUp } from "lucide-react";

export function AnalyticsMetrics({ analytics, strategies }: { analytics: NicheAnalytics[], strategies: Strategy[] }) {
    return (
        <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" /> Visual Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ratings Bar */}
                <Card className="bg-background border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" /> Avg Rating
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            {analytics.map((niche) => (
                                <div key={niche.keyword} className="flex items-center gap-2">
                                    <Badge className="bg-muted text-foreground px-2 py-1 text-xs font-semibold min-w-[80px]">
                                        {niche.keyword}
                                    </Badge>
                                    <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
                                        <div
                                            className="h-2 rounded bg-yellow-400 transition-all"
                                            style={{
                                                width: `${((niche.avgAmazonRating ?? 0) / 5) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground w-8 text-right">
                                        {niche.avgAmazonRating?.toFixed(2) ?? "-"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                {/* Price Bar */}
                <Card className="bg-background border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Tag className="w-4 h-4 text-blue-300" /> Avg Price
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            {analytics.map((niche) => {
                                const maxPrice = Math.max(...analytics.map(n => n.avgAmazonPrice ?? 0));
                                return (
                                    <div key={niche.keyword} className="flex items-center gap-2">
                                        <Badge className="bg-muted text-foreground px-2 py-1 text-xs font-semibold min-w-[80px]">
                                            {niche.keyword}
                                        </Badge>
                                        <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
                                            <div
                                                className="h-2 rounded bg-blue-400 transition-all"
                                                style={{
                                                    width: `${maxPrice ? ((niche.avgAmazonPrice ?? 0) / maxPrice) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground w-12 text-right">
                                            {niche.avgAmazonPrice !== undefined ? `$${niche.avgAmazonPrice.toFixed(2)}` : "-"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
                {/* Sales Volume Bar */}
                <Card className="bg-background border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Package className="w-4 h-4 text-orange-400" /> Sales Volume
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            {analytics.map((niche) => {
                                const maxSales = Math.max(...analytics.map(n => n.totalAmazonSalesVolume ?? 0));
                                return (
                                    <div key={niche.keyword} className="flex items-center gap-2">
                                        <Badge className="bg-muted text-foreground px-2 py-1 text-xs font-semibold min-w-[80px]">
                                            {niche.keyword}
                                        </Badge>
                                        <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
                                            <div
                                                className="h-2 rounded bg-orange-400 transition-all"
                                                style={{
                                                    width: `${maxSales ? ((niche.totalAmazonSalesVolume ?? 0) / maxSales) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground w-12 text-right">
                                            {niche.totalAmazonSalesVolume?.toLocaleString() ?? "-"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}