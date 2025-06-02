import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Niche } from "@/types/niche";
import { Strategy } from "@/types/strategies";
import { Badge } from "@/components/ui/badge";
import { Package, Star, Tag, TrendingUp, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProfitScoreWithStrategy } from "@/lib/functions/strategies/calculate-score";
import { getIconComponent } from "@/components/helpers";

/**
 * Visual summary of key analytics metrics for all niches, highlighting how each strategy relates to the metrics.
 * Shows comparative bars for rating, price, sales, and reviews, con el icono de la estrategia si el nicho es afín a ella.
 */
export function AnalyticsMetrics({
    analytics,
    strategies,
}: { analytics: Niche[]; strategies: Strategy[] }) {
    if (!analytics?.length || !strategies?.length) return null;

    // Precompute max values for normalization
    const maxRating = 5;
    const maxPrice = Math.max(...analytics.map(n => n.avgAmazonPrice ?? 0), 1);
    const maxSales = Math.max(...analytics.map(n => n.totalAmazonSalesVolume ?? 0), 1);
    const maxReviews = Math.max(...analytics.map(n => n.avgAmazonReviews ?? 0), 1);

    return (
        <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" /> Visual Analysis by Strategy
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ratings Bar */}
                <MetricCard
                    title="Avg Rating"
                    icon={<Star className="w-4 h-4 text-yellow-400" />}
                    analytics={analytics}
                    strategies={strategies}
                    valueKey="avgAmazonRating"
                    max={maxRating}
                    color="bg-yellow-400"
                    format={v => v?.toFixed(2) ?? "-"}
                    metricType="rating"
                />
                {/* Price Bar */}
                <MetricCard
                    title="Avg Price"
                    icon={<Tag className="w-4 h-4 text-blue-300" />}
                    analytics={analytics}
                    strategies={strategies}
                    valueKey="avgAmazonPrice"
                    max={maxPrice}
                    color="bg-blue-400"
                    format={v => v !== undefined ? `$${v.toFixed(2)}` : "-"}
                    metricType="price"
                />
                {/* Sales Volume Bar */}
                <MetricCard
                    title="Sales Volume"
                    icon={<Package className="w-4 h-4 text-orange-400" />}
                    analytics={analytics}
                    strategies={strategies}
                    valueKey="totalAmazonSalesVolume"
                    max={maxSales}
                    color="bg-orange-400"
                    format={v => v !== undefined ? v.toLocaleString() : "-"}
                    metricType="sales"
                />
                {/* Reviews Bar */}
                <MetricCard
                    title="Avg Reviews"
                    icon={<Users className="w-4 h-4 text-green-400" />}
                    analytics={analytics}
                    strategies={strategies}
                    valueKey="avgAmazonReviews"
                    max={maxReviews}
                    color="bg-green-400"
                    format={v => v !== undefined ? v.toLocaleString() : "-"}
                    metricType="reviews"
                />
            </div>
        </section>
    );
}

type MetricCardProps = {
    title: string;
    icon: React.ReactNode;
    analytics: Niche[];
    strategies: Strategy[];
    valueKey: keyof Niche;
    max: number;
    color: string;
    format: (v: any) => string;
    metricType: "rating" | "price" | "sales" | "reviews";
};

function MetricCard({
    title,
    icon,
    analytics,
    strategies,
    valueKey,
    max,
    color,
    format,
    metricType,
}: MetricCardProps) {
    return (
        <Card className="bg-background border shadow-sm max-h-[340px] overflow-y-auto scrollbar-y-none">
            <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    {icon}{title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <MetricBar
                    analytics={analytics}
                    strategies={strategies}
                    valueKey={valueKey}
                    max={max}
                    color={color}
                    format={format}
                    metricType={metricType}
                />
            </CardContent>
        </Card>
    );
}

type MetricBarProps = {
    analytics: Niche[];
    strategies: Strategy[];
    valueKey: keyof Niche;
    max: number;
    color: string;
    format: (v: any) => string;
    metricType: "rating" | "price" | "sales" | "reviews";
};

function MetricBar({
    analytics,
    strategies,
    valueKey,
    max,
    color,
    format,
    metricType,
}: MetricBarProps) {
    return (
        <div className="flex flex-col gap-2">
            {analytics.map((niche) => (
                <div key={niche.keyword} className="flex items-center gap-2">
                    <Badge variant={"secondary"} className="min-w-[80px]">
                        {niche.keyword}
                    </Badge>
                    <div className="flex-1 h-2 rounded bg-muted overflow-hidden">
                        <div
                            className={cn("h-2 rounded transition-all", color)}
                            style={{
                                width: `${max ? (Math.min(Number(niche[valueKey] ?? 0), max) / max) * 100 : 0}%`,
                            }}
                        />
                    </div>
                    <span className="text-xs text-muted-foreground w-14 text-right">
                        {format(niche[valueKey])}
                    </span>
                    {/* Estrategias afines */}
                    <span className="flex gap-1 ml-2">
                        {strategies.map(strategy => {
                            let aligned = false;
                            const { ratingScore, priceScore, salesScore, reviewsScore } = getProfitScoreWithStrategy(niche, strategy);
                            switch (metricType) {
                                case "rating":
                                    aligned = ratingScore >= 0.7;
                                    break;
                                case "price":
                                    aligned = priceScore >= 0.7;
                                    break;
                                case "sales":
                                    aligned = salesScore >= 0.7;
                                    break;
                                case "reviews":
                                    aligned = (niche.avgAmazonReviews ?? Infinity) < strategy.reviewsTop;
                                    break;
                            }
                            return aligned ? (
                                <span key={strategy.id} title={`Afín a estrategia ${strategy.name}`}>
                                    {getIconComponent(strategy.icon, "w-4 h-4 text-primary")}
                                </span>
                            ) : null;
                        })}
                    </span>
                </div>
            ))}
        </div>
    );
}