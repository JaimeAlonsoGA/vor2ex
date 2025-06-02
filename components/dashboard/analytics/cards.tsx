import { Badge } from "@/components/ui/badge";
import {
    TrendingUp, Star, Users, Calendar, Tag, Award, Box, ShieldCheck, Flame, Percent, Truck, Megaphone, Layers, BadgeCheck
} from "lucide-react";
import { formatDate } from "@/lib/functions/amazon/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Niche } from "@/types/niche";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const CARD_HEIGHT = "h-40";
export const CARD_WIDTH = "w-full";

export interface CardConfig {
    key: string;
    icon: React.ReactNode;
    title: string;
    badge: React.JSX.Element;
    value: string | number;
    subtitle?: string;
    skeleton: React.ReactNode;
}

export const DEFAULT_PINNED = [
    "amazon-price",
    "amazon-rating",
    "alibaba-price",
    "amazon-categories",
];

const AMAZON_COLOR = "text-forground border-blue-500";
const ALIBABA_COLOR = "text-forground border-orange-500";

export const getCardsConfig = (niche?: Niche): CardConfig[] => [
    // Amazon
    {
        key: "amazon-total",
        icon: <Box className="h-5 w-5 text-blue-500" />,
        title: "Products",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: niche?.totalAmazonProducts ?? "-",
        subtitle: "Products found",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-price",
        icon: <Tag className="h-5 w-5 text-green-500" />,
        title: "Price",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: niche?.avgAmazonPrice !== undefined ? `$${niche.avgAmazonPrice.toFixed(2)}` : "-",
        subtitle:
            niche?.minAmazonPrice !== undefined && niche?.maxAmazonPrice !== undefined
                ? `Min: $${niche.minAmazonPrice.toFixed(2)} / Max: $${niche.maxAmazonPrice.toFixed(2)}`
                : "No range data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-rating",
        icon: <Star className="h-5 w-5 text-yellow-500" />,
        title: "Rating",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: niche?.avgAmazonRating !== undefined ? niche.avgAmazonRating.toFixed(2) : "-",
        subtitle: niche?.totalAmazonReviews !== undefined
            ? `${niche.totalAmazonReviews.toLocaleString()} total reviews`
            : "No review data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-sales",
        icon: <Truck className="h-5 w-5 text-purple-500" />,
        title: "Inventory",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: niche?.avgAmazonSalesVolume !== undefined ? niche.avgAmazonSalesVolume.toLocaleString() : "-",
        subtitle: niche?.totalAmazonSalesVolume !== undefined
            ? `${niche.totalAmazonSalesVolume.toLocaleString()}+ bought last month`
            : "No sales data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-brands",
        icon: <Users className="h-5 w-5 text-pink-500" />,
        title: "Brands",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: niche?.uniqueAmazonBrands ?? "-",
        subtitle: niche?.topAmazonBrand ? `Top: ${niche.topAmazonBrand}` : "No top brand data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-reviews",
        icon: <Star className="h-5 w-5 text-orange-500" />,
        title: "Reviews",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: niche?.avgAmazonReviews !== undefined ? niche.avgAmazonReviews : "-",
        subtitle: `Min: ${niche?.minAmazonReviews !== undefined ? niche.minAmazonReviews : "-"} / Max: ${niche?.maxAmazonReviews !== undefined ? niche.maxAmazonReviews : "-"}`,
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-ranking",
        icon: <TrendingUp className="h-5 w-5 text-red-500" />,
        title: "Ranking",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: niche?.avgAmazonRanking !== undefined ? niche.avgAmazonRanking.toFixed(0) : "-",
        subtitle:
            niche?.minAmazonRanking !== undefined && niche?.maxAmazonRanking !== undefined
                ? `Min: #${niche.minAmazonRanking} / Max: #${niche.maxAmazonRanking}`
                : "No ranking data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-dates",
        icon: <Calendar className="h-5 w-5 text-cyan-500" />,
        title: "Launch",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: niche?.avgAmazonDate ? formatDate(niche.avgAmazonDate) : "-",
        subtitle:
            niche?.oldestAmazonDate && niche?.newestAmazonDate
                ? `Most recent: ${formatDate(niche.newestAmazonDate)} / Oldest: ${formatDate(niche.oldestAmazonDate)}`
                : "No date data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-bestseller",
        icon: <Flame className="h-5 w-5 text-red-500" />,
        title: "Best Seller",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: niche?.bestSellerCount !== undefined ? `${niche.bestSellerCount}` : "-",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-choice",
        icon: <Award className="h-5 w-5 text-indigo-500" />,
        title: "Amazon's Choice",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: niche?.amazonChoiceCount !== undefined ? `${niche.amazonChoiceCount}` : "-",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-prime",
        icon: <ShieldCheck className="h-5 w-5 text-blue-400" />,
        title: "Prime",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        subtitle: "Total Prime on first page",
        value: niche?.totalAmazonOfferCount !== undefined ? `${niche.totalAmazonOfferCount}` : "-",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-offers",
        icon: <Percent className="h-5 w-5 text-purple-500" />,
        title: "Offers",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        subtitle: "Total offers on first page",
        value: niche?.primeCount !== undefined ? `${niche?.primeCount}` : "-",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-sponsored",
        icon: <Megaphone className="h-5 w-5 text-rose-500" />,
        title: "Sponsored",
        subtitle: "Total sponsored on the first page",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        value: niche?.totalAmazonSponsored !== undefined ? `${niche.totalAmazonSponsored}` : "-",
        skeleton: <CardSkeleton />,
    },
    // Alibaba
    {
        key: "alibaba-total",
        icon: <Box className="h-5 w-5 text-orange-500" />,
        title: "Products",
        badge: <Badge variant={"outline"} className={ALIBABA_COLOR}>Alibaba</Badge>,
        value: niche?.totalAlibabaProducts ?? "-",
        subtitle: "Products found",
        skeleton: <CardSkeleton />,
    },
    {
        key: "alibaba-price",
        icon: <Tag className="h-5 w-5 text-amber-500" />,
        title: "Price",
        badge: <Badge variant={"outline"} className={ALIBABA_COLOR}>Alibaba</Badge>,
        value: niche?.avgAlibabaPrice !== undefined ? `$${niche.avgAlibabaPrice.toFixed(2)}` : "-",
        subtitle:
            niche?.minAlibabaPrice !== undefined && niche?.maxAlibabaPrice !== undefined
                ? `Min: $${niche.minAlibabaPrice.toFixed(2)} / Max: $${niche.maxAlibabaPrice.toFixed(2)}`
                : "No range data",
        skeleton: <CardSkeleton />,
    },
    {
        key: "alibaba-verified",
        icon: <BadgeCheck className="h-5 w-5 text-green-500" />,
        title: "Verified",
        badge: <Badge variant={"outline"} className={ALIBABA_COLOR}>Alibaba</Badge>,
        value: niche?.totalAlibabaVerifiedSuppliers !== undefined ? `${niche.totalAlibabaVerifiedSuppliers}` : "-",
        subtitle: "Total verified suppliers",
        skeleton: <CardSkeleton />,
    },
    {
        key: "alibaba-guaranteed",
        icon: <ShieldCheck className="h-5 w-5 text-lime-500" />,
        title: "Guaranteed",
        badge: <Badge variant={"outline"} className={ALIBABA_COLOR}>Alibaba</Badge>,
        value: niche?.totalAlibabaGuaranteedSuppliers !== undefined ? `${niche.totalAlibabaGuaranteedSuppliers}` : "-",
        subtitle: "Total guaranteed suppliers",
        skeleton: <CardSkeleton />,
    },
    {
        key: "amazon-categories",
        icon: <Layers className="h-5 w-5 text-cyan-500" />,
        title: "Categories",
        badge: <Badge variant={"outline"} className={AMAZON_COLOR}>Amazon</Badge>,
        subtitle: `Top category: ${niche?.topCategory ?? "-"}`,
        value: niche?.uniqueCategories !== undefined ? `${niche.uniqueCategories}` : "-",
        skeleton: <CardSkeleton />,
    },
    {
        key: "alibaba-suppliers",
        icon: <Users className="h-5 w-5 text-violet-500" />,
        title: "Suppliers",
        badge: <Badge variant={"outline"} className={ALIBABA_COLOR}>Alibaba</Badge>,
        subtitle: "Total unique suppliers on first page",
        value: niche?.uniqueAlibabaSuppliers ?? "-",
        skeleton: <CardSkeleton />,
    },
    {
        key: "alibaba-moq",
        icon: <Tag className="h-5 w-5 text-teal-500" />,
        title: "MOQ",
        subtitle: niche?.avgAlibabaMinOrderQuantity
            ? `Min | Max: ${[
                niche?.minAlibabaMinOrderQuantity !== undefined ? `${niche.minAlibabaMinOrderQuantity}` : null,
                niche?.maxAlibabaMinOrderQuantity !== undefined ? `${niche.maxAlibabaMinOrderQuantity}` : null,
            ]
                .filter(Boolean)
                .join(" - ") || "-"}`
            : "",
        badge: <Badge variant={"outline"} className={ALIBABA_COLOR}>Alibaba</Badge>,
        value: niche?.avgAlibabaMinOrderQuantity !== undefined ? `${niche.avgAlibabaMinOrderQuantity}` : "-",
        skeleton: <CardSkeleton />,
    },
];

export function CardSkeleton() {
    return (
        <div className="flex flex-col justify-center items-start h-full w-full gap-3">
            <Skeleton className="h-8 w-24 mb-2 rounded-md" />
            <Skeleton className="h-4 w-32 rounded" />
        </div>
    );
}

export function CardBody({ value, subtitle }: { value: string | number; subtitle?: string }) {
    return (
        <div className="flex flex-col justify-center h-full w-full">
            <div className="text-lg font-bold truncate">{value}</div>
            {subtitle && (
                <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
            )}
        </div>
    );
}

export function renderCard(card: CardConfig, section: "pinned" | "other") {
    return (
        <div
            key={card.key}
            className={cn(
                "transition-shadow duration-300",
                "relative"
            )}
            style={{
                transition: "box-shadow 0.2s, transform 0.2s",
            }}
        >
            <Card className={cn(CARD_HEIGHT, CARD_WIDTH, "flex flex-col justify-between")}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        {card.icon}
                        {card.title}
                    </CardTitle>
                    {card.badge}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center h-full">
                    <CardBody value={card.value} subtitle={card.subtitle} />
                </CardContent>
            </Card>
        </div>
    );
}