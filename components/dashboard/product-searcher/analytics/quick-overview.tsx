import { useState } from "react";
import { NicheAnalytics } from "@/types/analytics/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    TrendingUp, Star, Users, Calendar, Tag, ChevronDown, ChevronUp,
    Award, Box, ShieldCheck, GripVertical, Flame, Percent, Truck, Megaphone, Layers, BadgeCheck
} from "lucide-react";
import { formatDate } from "@/lib/functions/amazon/utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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

interface NicheQuickOverviewProps {
    analytics?: NicheAnalytics;
    isLoading: boolean;
}

const DEFAULT_PINNED = [
    "amazon-price",
    "amazon-rating",
    "alibaba-price",
    "amazon-categories",
];

const AMAZON_COLOR = "text-forground border-blue-500";
const ALIBABA_COLOR = "text-forground border-orange-500";

const getCardsConfig = (analytics?: NicheAnalytics): CardConfig[] => [
    // Amazon
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

export function NicheQuickOverview({ analytics, isLoading }: NicheQuickOverviewProps) {
    const cardsConfig = getCardsConfig(analytics);
    const [pinned, setPinned] = useState<string[]>(DEFAULT_PINNED);
    const [order, setOrder] = useState<string[]>(cardsConfig.map(card => card.key).filter(k => !DEFAULT_PINNED.includes(k)));
    const [dragged, setDragged] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [expanded, setExpanded] = useState(false);

    function handleDragStart(key: string) { setDragged(key); }
    function handleDragEnter(overKey: string) { setDragOver(overKey); }
    function handleDragEnd() { setDragged(null); setDragOver(null); }
    function handleDrop(overKey: string, section: "pinned" | "other") {
        if (!dragged || dragged === overKey) { setDragged(null); setDragOver(null); return; }
        if (section === "pinned") {
            const fromIdx = pinned.indexOf(dragged);
            const toIdx = pinned.indexOf(overKey);
            if (fromIdx === -1 || toIdx === -1) return;
            const newPinned = [...pinned];
            newPinned.splice(fromIdx, 1);
            newPinned.splice(toIdx, 0, dragged);
            setPinned(newPinned);
        } else {
            const fromIdx = order.indexOf(dragged);
            const toIdx = order.indexOf(overKey);
            if (fromIdx === -1 || toIdx === -1) return;
            const newOrder = [...order];
            newOrder.splice(fromIdx, 1);
            newOrder.splice(toIdx, 0, dragged);
            setOrder(newOrder);
        }
        setDragged(null); setDragOver(null);
    }
    function moveCard(key: string, from: "pinned" | "other", to: "pinned" | "other") {
        if (from === to) return;
        if (from === "pinned") {
            setPinned(pinned => pinned.filter(k => k !== key));
            setOrder(order => [key, ...order]);
        } else {
            setOrder(order => order.filter(k => k !== key));
            setPinned(pinned => [...pinned, key]);
        }
    }

    const editCardClass =
        "shadow-xl ring-2 ring-primary/40 bg-background/80 scale-105 animate-[float_1.2s_ease-in-out_infinite,shake_0.2s_linear_infinite] z-20";

    function renderCard(card: CardConfig, section: "pinned" | "other") {
        return (
            <div
                key={card.key}
                draggable={editMode}
                tabIndex={editMode ? 0 : -1}
                onDragStart={() => editMode && handleDragStart(card.key)}
                onDragEnter={() => editMode && handleDragEnter(card.key)}
                onDragOver={e => {
                    if (!editMode) return;
                    e.preventDefault();
                    setDragOver(card.key);
                }}
                onDrop={() => editMode && handleDrop(card.key, section)}
                onDragEnd={handleDragEnd}
                className={cn(
                    "transition-shadow duration-300",
                    editMode && editCardClass,
                    dragged === card.key && "opacity-60 z-30",
                    dragOver === card.key && editMode && "ring-4 ring-primary/70 scale-110 shadow-2xl",
                    "relative"
                )}
                style={{
                    cursor: editMode ? "grab" : "default",
                    transition: "box-shadow 0.2s, transform 0.2s",
                }}
            >
                <Card className={cn(CARD_HEIGHT, CARD_WIDTH, "flex flex-col justify-between")}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            {editMode && (
                                <GripVertical className="h-4 w-4 text-primary animate-pulse mr-1" />
                            )}
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
                {editMode && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 z-40 cursor-pointer"
                        title={section === "pinned" ? "Move to lower section" : "Move to featured"}
                        onClick={() =>
                            section === "pinned"
                                ? moveCard(card.key, "pinned", "other")
                                : moveCard(card.key, "other", "pinned")
                        }
                        tabIndex={-1}
                    >
                        {section === "pinned" ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </Button>
                )}
                {editMode && dragged === card.key && (
                    <div className="absolute inset-0 bg-primary/10 rounded-lg pointer-events-none z-40" />
                )}
            </div>
        );
    }

    return (
        <section aria-label="Quick niche overview" className="w-full">
            {/* Featured section (pinned) */}
            <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Featured</span>
                    <div className="flex-1 border-t border-dashed border-muted" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pinned.map(key => renderCard(cardsConfig.find(c => c.key === key)!, "pinned"))}
                </div>
            </div>
            {/* Visual separator */}
            <div className="flex items-center gap-2 my-4">
                <div className="flex-1 border-t border-muted" />
                <span className="text-xs text-muted-foreground">Other analytics</span>
                <div className="flex-1 border-t border-muted" />
            </div>
            {/* Collapsible section */}
            <div
                className={cn(
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all",
                    expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                )}
                aria-hidden={!expanded}
            >
                {order.map(key => renderCard(cardsConfig.find(c => c.key === key)!, "other"))}
            </div>
            <div className="flex justify-center mt-2 gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 cursor-pointer"
                    aria-expanded={expanded}
                    aria-controls="niche-analytics-extra"
                    onClick={() => setExpanded(prev => !prev)}
                >
                    {expanded ? "Hide analytics" : "Show all analytics"}
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <Button
                    variant={editMode ? "secondary" : "outline"}
                    size="sm"
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setEditMode(e => !e)}
                    aria-pressed={editMode}
                >
                    {editMode ? "Exit edit mode" : "Edit cards"}
                </Button>
            </div>
        </section>
    );
}

export default NicheQuickOverview;