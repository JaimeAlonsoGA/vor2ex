import { NicheAnalytics } from "@/types/analytics/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp, Star, Users, Calendar, Tag, Award, Box, ShieldCheck, GripVertical, Flame, Percent, Truck, Megaphone, Layers, BadgeCheck,
    ArrowLeft
} from "lucide-react";
import { formatDate } from "@/lib/functions/amazon/utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Arrow } from "@radix-ui/react-dropdown-menu";

const CARD_HEIGHT = "h-40";
const CARD_WIDTH = "w-full";

interface CardConfig {
    key: string;
    icon: React.ReactNode;
    title: string;
    badge: React.JSX.Element;
    value: string | number;
    subtitle?: string;
    skeleton: React.ReactNode;
}

interface NicheQuickOverviewSimpleProps {
    analytics?: NicheAnalytics;
    isLoading: boolean;
    goBack: () => void;
    goBackMessage?: string;
}

const AMAZON_COLOR = "text-forground border-blue-500";
const ALIBABA_COLOR = "text-forground border-orange-500";

const getCardsConfig = (analytics?: NicheAnalytics): CardConfig[] => [
    {
        key: "amazon-total",
        icon: <Box className="h-5 w-5 text-blue-500" />,
        title: "Products",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: analytics?.totalAmazonProducts ?? "-",
        subtitle: "Products found",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-price",
        icon: <Tag className="h-5 w-5 text-green-500" />,
        title: "Price",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: analytics?.avgAmazonPrice !== undefined ? `$${analytics.avgAmazonPrice.toFixed(2)}` : "-",
        subtitle:
            analytics?.minAmazonPrice !== undefined && analytics?.maxAmazonPrice !== undefined
                ? `Min: $${analytics.minAmazonPrice.toFixed(2)} / Max: $${analytics.maxAmazonPrice.toFixed(2)}`
                : "No range data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-rating",
        icon: <Star className="h-5 w-5 text-yellow-500" />,
        title: "Rating",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: analytics?.avgAmazonRating !== undefined ? analytics.avgAmazonRating.toFixed(2) : "-",
        subtitle: analytics?.totalAmazonReviews !== undefined
            ? `${analytics.totalAmazonReviews.toLocaleString()} total reviews`
            : "No review data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-sales",
        icon: <Truck className="h-5 w-5 text-purple-500" />,
        title: "Inventory",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: analytics?.avgAmazonSalesVolume !== undefined ? analytics.avgAmazonSalesVolume.toLocaleString() : "-",
        subtitle: analytics?.totalAmazonSalesVolume !== undefined
            ? `${analytics.totalAmazonSalesVolume.toLocaleString()}+ bought last month`
            : "No sales data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-brands",
        icon: <Users className="h-5 w-5 text-pink-500" />,
        title: "Brands",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: analytics?.uniqueAmazonBrands ?? "-",
        subtitle: analytics?.topAmazonBrand ? `Top: ${analytics.topAmazonBrand}` : "No top brand data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-reviews",
        icon: <Star className="h-5 w-5 text-orange-500" />,
        title: "Reviews",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: analytics?.avgAmazonReviews !== undefined ? analytics.avgAmazonReviews : "-",
        subtitle: `Min: ${analytics?.minAmazonReviews !== undefined ? analytics.minAmazonReviews : "-"} / Max: ${analytics?.maxAmazonReviews !== undefined ? analytics.maxAmazonReviews : "-"}`,
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-ranking",
        icon: <TrendingUp className="h-5 w-5 text-red-500" />,
        title: "Ranking",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: analytics?.avgAmazonRanking !== undefined ? analytics.avgAmazonRanking.toFixed(0) : "-",
        subtitle:
            analytics?.minAmazonRanking !== undefined && analytics?.maxAmazonRanking !== undefined
                ? `Min: #${analytics.minAmazonRanking} / Max: #${analytics.maxAmazonRanking}`
                : "No ranking data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-dates",
        icon: <Calendar className="h-5 w-5 text-cyan-500" />,
        title: "Launch",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: analytics?.avgAmazonDate ? formatDate(analytics.avgAmazonDate) : "-",
        subtitle:
            analytics?.oldestAmazonDate && analytics?.newestAmazonDate
                ? `Most recent: ${formatDate(analytics.newestAmazonDate)} / Oldest: ${formatDate(analytics.oldestAmazonDate)}`
                : "No date data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-bestseller",
        icon: <Flame className="h-5 w-5 text-red-500" />,
        title: "Best Seller",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: analytics?.bestSellerCount !== undefined ? `${analytics.bestSellerCount}` : "-",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-choice",
        icon: <Award className="h-5 w-5 text-indigo-500" />,
        title: "Amazon's Choice",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: analytics?.amazonChoiceCount !== undefined ? `${analytics.amazonChoiceCount}` : "-",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-prime",
        icon: <ShieldCheck className="h-5 w-5 text-blue-400" />,
        title: "Prime",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        subtitle: "Total Prime on first page",
        value: analytics?.totalAmazonOfferCount !== undefined ? `${analytics.totalAmazonOfferCount}` : "-",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-offers",
        icon: <Percent className="h-5 w-5 text-purple-500" />,
        title: "Offers",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        subtitle: "Total offers on first page",
        value: analytics?.primeCount !== undefined ? `${analytics?.primeCount}` : "-",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-sponsored",
        icon: <Megaphone className="h-5 w-5 text-rose-500" />,
        title: "Sponsored",
        subtitle: "Total sponsored on the first page",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: analytics?.totalAmazonSponsored !== undefined ? `${analytics.totalAmazonSponsored}` : "-",
        skeleton: <CardSkeleton />,
    },
    // Alibaba
    {
        key: "alibaba-total",
        icon: <Box className="h-5 w-5 text-orange-500" />,
        title: "Products",
        badge: <Badge variant={"outline"} className={ALIBABA_COLOR}>Alibaba</Badge>,
        value: analytics?.totalAlibabaProducts ?? "-",
        subtitle: "Products found",
        skeleton: <CardSkeleton />,
    },
    {
        key: "alibaba-price",
        icon: <Tag className="h-5 w-5 text-amber-500" />,
        title: "Price",
        badge: <Badge variant={"outline"} className={ALIBABA_COLOR}>Alibaba</Badge>,
        value: analytics?.avgAlibabaPrice !== undefined ? `$${analytics.avgAlibabaPrice.toFixed(2)}` : "-",
        subtitle:
            analytics?.minAlibabaPrice !== undefined && analytics?.maxAlibabaPrice !== undefined
                ? `Min: $${analytics.minAlibabaPrice.toFixed(2)} / Max: $${analytics.maxAlibabaPrice.toFixed(2)}`
                : "No range data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "alibaba-verified",
        icon: <BadgeCheck className="h-5 w-5 text-green-500" />,
        title: "Verified",
        badge: <Badge variant={"outline"} className={ALIBABA_COLOR}>Alibaba</Badge>,
        value: analytics?.totalAlibabaVerifiedSuppliers !== undefined ? `${analytics.totalAlibabaVerifiedSuppliers}` : "-",
        subtitle: "Total verified suppliers",
        skeleton: <CardSkeleton />,
    },
    {
        key: "alibaba-guaranteed",
        icon: <ShieldCheck className="h-5 w-5 text-lime-500" />,
        title: "Guaranteed",
        badge: <Badge variant={"outline"} className={ALIBABA_COLOR}>Alibaba</Badge>,
        value: analytics?.totalAlibabaGuaranteedSuppliers !== undefined ? `${analytics.totalAlibabaGuaranteedSuppliers}` : "-",
        subtitle: "Total guaranteed suppliers",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-categories",
        icon: <Layers className="h-5 w-5 text-cyan-500" />,
        title: "Categories",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        subtitle: `Top category: ${analytics?.topCategory ?? "-"}`,
        value: analytics?.uniqueCategories !== undefined ? `${analytics.uniqueCategories}` : "-",
        skeleton: <CardSkeleton />,
    },
    {
        key: "alibaba-suppliers",
        icon: <Users className="h-5 w-5 text-violet-500" />,
        title: "Suppliers",
        badge: <Badge variant={"outline"} className={ALIBABA_COLOR}>Alibaba</Badge>,
        subtitle: "Total unique suppliers on first page",
        value: analytics?.uniqueAlibabaSuppliers ?? "-",
        skeleton: <CardSkeleton />,
    },
    {
        key: "alibaba-moq",
        icon: <Tag className="h-5 w-5 text-teal-500" />,
        title: "MOQ",
        subtitle: analytics?.avgAlibabaMinOrderQuantity
            ? `Min | Max: ${[
                analytics?.minAlibabaMinOrderQuantity !== undefined ? `${analytics.minAlibabaMinOrderQuantity}` : null,
                analytics?.maxAlibabaMinOrderQuantity !== undefined ? `${analytics.maxAlibabaMinOrderQuantity}` : null,
            ]
                .filter(Boolean)
                .join(" - ") || "-"}`
            : "",
        badge: <Badge variant={"outline"} className={ALIBABA_COLOR}>Alibaba</Badge>,
        value: analytics?.avgAlibabaMinOrderQuantity !== undefined ? `${analytics.avgAlibabaMinOrderQuantity}` : "-",
        skeleton: <CardSkeleton />,
    },
];

function CardSkeleton() {
    return (
        <div className="flex flex-col justify-center items-start h-full w-full gap-3">
            <Skeleton className="h-8 w-24 mb-2 rounded-md" />
            <Skeleton className="h-4 w-32 rounded" />
        </div>
    );
}

function CardBody({ value, subtitle }: { value: string | number; subtitle?: string }) {
    return (
        <div className="flex flex-col justify-center h-full w-full">
            <div className="text-lg font-bold truncate">{value}</div>
            {subtitle && (
                <div className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</div>
            )}
        </div>
    );
}

export function NicheQuickOverviewSimple({ analytics, isLoading, goBack, goBackMessage }: NicheQuickOverviewSimpleProps) {
    const cardsConfig = useMemo(() => getCardsConfig(analytics), [analytics]);

    return (
        <section aria-label="Niche analytics overview" className="space-y-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => goBack()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {goBackMessage ?? "Go Back"}
                </Button>
                <span className="text-lg font-semibold">
                    <span className="text-primary">{analytics?.keyword}</span>
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cardsConfig.map(card => (
                    <Card key={card.key} className={cn(CARD_HEIGHT, CARD_WIDTH, "flex flex-col justify-between hover:bg-muted-foreground/10 transition-colors")}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                {card.icon}
                                {card.title}
                            </CardTitle>
                            {card.badge}
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-center h-full">
                            {isLoading
                                ? <CardSkeleton />
                                : <CardBody value={card.value} subtitle={card.subtitle} />}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}

export default NicheQuickOverviewSimple;