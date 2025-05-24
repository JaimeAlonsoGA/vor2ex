import { useState } from "react";
import { NicheAnalytics } from "@/types/niche-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Star, ShoppingCart, Users, Calendar, Tag, ChevronDown, ChevronUp, Award, Box, ShieldCheck, GripVertical, Flame, CirclePercent, Ship, Megaphone, PawPrint } from "lucide-react";
import { formatDate } from "@/lib/functions/amazon/utils";
import { cn } from "@/lib/utils";

const CARD_HEIGHT = "h-32";
const CARD_WIDTH = "w-full";

// Skeleton helper
function SkeletonBlock({ className = "", isLoading }: { className?: string, isLoading: boolean }) {
    return (
        <div className={cn(isLoading && "animate-pulse", "bg-muted rounded", className)} />
    );
}

interface CardConfig {
    key: string;
    icon: React.ReactNode;
    title: string;
    badge: string;
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

export function NicheQuickOverview({ analytics, isLoading }: NicheQuickOverviewProps) {
    const [editMode, setEditMode] = useState(false);
    const [expanded, setExpanded] = useState(false);

    // Todas las cards, agrupadas inteligentemente
    const cardsConfig: CardConfig[] = [
        {
            key: "amazon-total",
            icon: <ShoppingCart className="h-5 w-5 text-green-600" />,
            title: "Productos",
            badge: "Amazon",
            value: analytics?.totalAmazonProducts ?? "-",
            subtitle: "Productos encontrados",
            skeleton: <><SkeletonBlock className="h-8 w-20 mb-2" isLoading={isLoading} /><SkeletonBlock className="h-4 w-24" isLoading={isLoading} /></>
        },
        {
            key: "amazon-price",
            icon: <Tag className="h-5 w-5 text-blue-600" />,
            title: "Precio",
            badge: "Amazon",
            value: analytics?.avgAmazonPrice !== undefined ? `$${analytics.avgAmazonPrice.toFixed(2)}` : "-",
            subtitle: analytics?.minAmazonPrice !== undefined && analytics?.maxAmazonPrice !== undefined
                ? `Rango: $${analytics.minAmazonPrice.toFixed(2)} - $${analytics.maxAmazonPrice.toFixed(2)}`
                : "Sin datos de rango",
            skeleton: <><SkeletonBlock className="h-8 w-20 mb-2" isLoading={isLoading} /><SkeletonBlock className="h-4 w-32" isLoading={isLoading} /></>
        },
        {
            key: "amazon-rating",
            icon: <Star className="h-5 w-5 text-yellow-500" />,
            title: "Valoración",
            badge: "Amazon",
            value: analytics?.avgAmazonRating !== undefined ? analytics.avgAmazonRating.toFixed(2) : "-",
            subtitle: analytics?.totalAmazonReviews !== undefined
                ? `${analytics.totalAmazonReviews.toLocaleString()} reseñas totales`
                : "Sin datos de reseñas",
            skeleton: <><SkeletonBlock className="h-8 w-20 mb-2" isLoading={isLoading} /><SkeletonBlock className="h-4 w-28" isLoading={isLoading} /></>
        },
        {
            key: "amazon-sales",
            icon: <Ship className="h-5 w-5 text-purple-600" />,
            title: "Inventario",
            badge: "Amazon",
            value: analytics?.avgAmazonSalesVolume !== undefined ? analytics.avgAmazonSalesVolume.toLocaleString() : "-",
            subtitle: analytics?.totalAmazonSalesVolume !== undefined
                ? `${analytics.totalAmazonSalesVolume.toLocaleString()}+ comprados el último mes`
                : "Sin datos de ventas",
            skeleton: <><SkeletonBlock className="h-8 w-20 mb-2" isLoading={isLoading} /><SkeletonBlock className="h-4 w-28" isLoading={isLoading} /></>
        },
        {
            key: "amazon-brands",
            icon: <Users className="h-5 w-5 text-pink-600" />,
            title: "Marcas",
            badge: "Amazon",
            value: analytics?.uniqueAmazonBrands ?? "-",
            subtitle: analytics?.topAmazonBrand ? `Top: ${analytics.topAmazonBrand}` : "Sin datos de top brand",
            skeleton: <><SkeletonBlock className="h-8 w-20 mb-2" isLoading={isLoading} /><SkeletonBlock className="h-4 w-24" isLoading={isLoading} /></>
        },
        {
            key: "amazon-reviews",
            icon: <Star className="h-5 w-5 text-yellow-500" />,
            title: "Reseñas",
            badge: "Amazon",
            value: analytics?.avgAmazonReviews !== undefined ? analytics.avgAmazonReviews.toFixed(2) : "-",
            subtitle: `Rango: ${analytics?.minAmazonReviews !== undefined ? analytics.minAmazonReviews.toFixed(2) : "-"} - ${analytics?.maxAmazonReviews !== undefined ? analytics.maxAmazonReviews.toFixed(2) : "-"}`,
            skeleton: <><SkeletonBlock className="h-8 w-20 mb-2" isLoading={isLoading} /><SkeletonBlock className="h-4 w-28" isLoading={isLoading} /></>
        },
        {
            key: "amazon-ranking",
            icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
            title: "Ranking",
            badge: "Amazon",
            value: analytics?.avgAmazonRanking !== undefined ? analytics.avgAmazonRanking.toFixed(0) : "-",
            subtitle: analytics?.minAmazonRanking !== undefined && analytics?.maxAmazonRanking !== undefined
                ? `Min: #${analytics.minAmazonRanking} / Max: #${analytics.maxAmazonRanking}`
                : "Sin datos de ranking",
            skeleton: <><SkeletonBlock className="h-8 w-20 mb-2" isLoading={isLoading} /><SkeletonBlock className="h-4 w-28" isLoading={isLoading} /></>
        },
        {
            key: "amazon-dates",
            icon: <Calendar className="h-5 w-5 text-gray-600" />,
            title: "Lanzamiento",
            badge: "Amazon",
            value: analytics?.avgAmazonDate ? formatDate(analytics.avgAmazonDate) : "-",
            subtitle: analytics?.oldestAmazonDate && analytics?.newestAmazonDate
                ? (`Más reciente: ${formatDate(analytics.newestAmazonDate)} / 
                   Más antiguo: ${formatDate(analytics.oldestAmazonDate)}`)
                : "Sin datos de fechas",
            skeleton: <SkeletonBlock className="h-8 w-20" isLoading={isLoading} />
        },
        {
            key: "amazon-bestseller",
            icon: <Flame className="h-5 w-5 text-yellow-700" />,
            title: "Best Seller",
            badge: "Amazon",
            value: analytics?.bestSellerCount !== undefined ? `${analytics.bestSellerCount}` : "-",
            skeleton: <SkeletonBlock className="h-8 w-20" isLoading={isLoading} />
        },
        {
            key: "amazon-choice",
            icon: <Award className="h-5 w-5 text-yellow-700" />,
            title: "Amazon's Choice",
            badge: "Amazon",
            value: analytics?.amazonChoiceCount !== undefined ? `${analytics.amazonChoiceCount}` : "-",
            skeleton: <SkeletonBlock className="h-8 w-20" isLoading={isLoading} />
        },
        {
            key: "amazon-prime",
            icon: <Box className="h-5 w-5 text-blue-700" />,
            title: "Prime",
            badge: "Amazon",
            subtitle: "Total de Prime en la primera página",
            value: analytics?.totalAmazonOfferCount !== undefined ? `${analytics.totalAmazonOfferCount}` : "-",
            skeleton: <SkeletonBlock className="h-8 w-20" isLoading={isLoading} />
        },
        {
            key: "amazon-offers",
            icon: <CirclePercent className="h-5 w-5 text-purple-600" />,
            title: "Ofertas",
            badge: "Amazon",
            subtitle: "Total de ofertas en la primera página",
            value: analytics?.primeCount !== undefined ? `${analytics?.primeCount}` : "-",
            skeleton: <SkeletonBlock className="h-8 w-20" isLoading={isLoading} />
        },
        {
            key: "alibaba-total",
            icon: <ShoppingCart className="h-5 w-5 text-orange-500" />,
            title: "Productos",
            badge: "Alibaba",
            value: analytics?.totalAlibabaProducts ?? "-",
            subtitle: "Productos encontrados",
            skeleton: <><SkeletonBlock className="h-8 w-20 mb-2" isLoading={isLoading} /><SkeletonBlock className="h-4 w-24" isLoading={isLoading} /></>
        },
        {
            key: "alibaba-price",
            icon: <Tag className="h-5 w-5 text-orange-600" />,
            title: "Precio",
            badge: "Alibaba",
            value: analytics?.avgAlibabaPrice !== undefined ? `$${analytics.avgAlibabaPrice.toFixed(2)}` : "-",
            subtitle: analytics?.minAlibabaPrice !== undefined && analytics?.maxAlibabaPrice !== undefined
                ? `Rango: $${analytics.minAlibabaPrice.toFixed(2)} - $${analytics.maxAlibabaPrice.toFixed(2)}`
                : "Sin datos de rango",
            skeleton: <><SkeletonBlock className="h-8 w-20 mb-2" isLoading={isLoading} /><SkeletonBlock className="h-4 w-32" isLoading={isLoading} /></>
        },
        {
            key: "amazon-categories",
            icon: <PawPrint className="h-5 w-5 text-gray-600" />,
            title: "Categorías",
            badge: "Amazon",
            subtitle: `Top category: ${analytics?.topCategory ?? "-"}`,
            value: analytics?.uniqueCategories !== undefined ? `${analytics.uniqueCategories}` : "-",
            skeleton: <SkeletonBlock className="h-8 w-20" isLoading={isLoading} />
        },
        {
            key: "alibaba-suppliers",
            icon: <Users className="h-5 w-5 text-orange-400" />,
            title: "Proveedores",
            badge: "Alibaba",
            subtitle: "Total unique suppliers on first page",
            value: analytics?.uniqueAlibabaSuppliers ?? "-",
            skeleton: <SkeletonBlock className="h-8 w-20 mb-2" isLoading={isLoading} />
        },
        {
            key: "alibaba-moq",
            icon: <ShieldCheck className="h-5 w-5 text-green-600" />,
            title: "MOQ",
            subtitle: analytics?.avgAlibabaMinOrderQuantity
                ? `Min | Max: ${[
                    analytics?.minAlibabaMinOrderQuantity !== undefined ? `${analytics.minAlibabaMinOrderQuantity}` : null,
                    analytics?.maxAlibabaMinOrderQuantity !== undefined ? `${analytics.maxAlibabaMinOrderQuantity}` : null,
                ].filter(Boolean).join(" - ") || "-"}`
                : "",
            badge: "Alibaba",
            value: analytics?.avgAlibabaMinOrderQuantity !== undefined ? `${analytics.avgAlibabaMinOrderQuantity}` : "-",
            skeleton: <SkeletonBlock className="h-8 w-20" isLoading={isLoading} />
        },
        {
            key: "amazon-sponsored",
            icon: <Megaphone className="h-5 w-5 text-pink-600" />,
            title: "Sponsored",
            subtitle: "Total sponsored on the first page",
            badge: "Amazon",
            value: analytics?.totalAmazonSponsored !== undefined ? `${analytics.totalAmazonSponsored}` : "-",
            skeleton: <SkeletonBlock className="h-8 w-20" isLoading={isLoading} />
        },
    ];

    // Estado para cards fijas y editables
    const [pinned, setPinned] = useState<string[]>(DEFAULT_PINNED);
    const [order, setOrder] = useState<string[]>(cardsConfig.map(card => card.key).filter(k => !DEFAULT_PINNED.includes(k)));
    const [dragged, setDragged] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState<string | null>(null);

    // Drag & drop helpers
    function handleDragStart(key: string) {
        setDragged(key);
    }

    function handleDragEnter(overKey: string) {
        setDragOver(overKey);
    }

    function handleDragEnd() {
        setDragged(null);
        setDragOver(null);
    }

    function handleDrop(overKey: string, section: "pinned" | "other") {
        if (!dragged || dragged === overKey) {
            setDragged(null);
            setDragOver(null);
            return;
        }
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
        setDragged(null);
        setDragOver(null);
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

    return (
        <section aria-label="Resumen rápido del nicho" className="w-full">
            {/* Sección fija (pinned) */}
            <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Destacados</span>
                    <div className="flex-1 border-t border-dashed border-muted" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pinned.map((key, i) => {
                        const card = cardsConfig.find(c => c.key === key)!;
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
                                onDrop={() => editMode && handleDrop(card.key, "pinned")}
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
                                        <Badge variant="secondary" className="text-xs">{card.badge}</Badge>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoading || !analytics ? card.skeleton : (
                                            <>
                                                <div className="text-lg font-bold">{card.value}</div>
                                                {card.subtitle && <div className="text-xs text-muted-foreground">{card.subtitle}</div>}
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                                {editMode && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 z-40"
                                        title="Mover a sección inferior"
                                        onClick={() => moveCard(card.key, "pinned", "other")}
                                        tabIndex={-1}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                )}
                                {editMode && dragged === card.key && (
                                    <div className="absolute inset-0 bg-primary/10 rounded-lg pointer-events-none z-40" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Separador visual */}
            <div className="flex items-center gap-2 my-4">
                <div className="flex-1 border-t border-muted" />
                <span className="text-xs text-muted-foreground">Otras analíticas</span>
                <div className="flex-1 border-t border-muted" />
            </div>
            {/* Sección colapsable */}
            <div
                className={cn(
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all",
                    expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                )}
                aria-hidden={!expanded}
            >
                {order.map((key, i) => {
                    const card = cardsConfig.find(c => c.key === key)!;
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
                            onDrop={() => editMode && handleDrop(card.key, "other")}
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
                                    <Badge variant="secondary" className="text-xs">{card.badge}</Badge>
                                </CardHeader>
                                <CardContent>
                                    {isLoading || !analytics ? card.skeleton : (
                                        <>
                                            <div className="text-lg font-bold">{card.value}</div>
                                            {card.subtitle && <div className="text-xs text-muted-foreground">{card.subtitle}</div>}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                            {editMode && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 z-40"
                                    title="Mover a destacados"
                                    onClick={() => moveCard(card.key, "other", "pinned")}
                                    tabIndex={-1}
                                >
                                    <ChevronUp className="h-4 w-4" />
                                </Button>
                            )}
                            {editMode && dragged === card.key && (
                                <div className="absolute inset-0 bg-primary/10 rounded-lg pointer-events-none z-40" />
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-center mt-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    aria-expanded={expanded}
                    aria-controls="niche-analytics-extra"
                    onClick={() => setExpanded(prev => !prev)}
                >
                    {expanded ? "Ocultar analíticas" : "Ver todas las analíticas"}
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <Button
                    variant={editMode ? "secondary" : "outline-solid"}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setEditMode(e => !e)}
                    aria-pressed={editMode}
                >
                    {editMode ? "Salir de edición" : "Editar cards"}
                </Button>
            </div>
        </section>
    );
}

export default NicheQuickOverview;