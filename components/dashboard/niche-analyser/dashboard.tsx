"use client";

import { NicheAnalytics } from "@/types/niche-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart2, ShoppingCart, Users, Star, Tag, TrendingUp, Trophy, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

// Nuevo score adaptado a tu lógica de negocio
function getProfitScore(a: NicheAnalytics) {
    // Rating: óptimo alrededor de 2.5, penaliza cuanto más lejos esté de 2.5
    const rating = a.avgAmazonRating ?? 0;
    const ratingScore = 1 - Math.abs(rating - 2.5) / 2.5; // 1 si es 2.5, 0 si es 0 o 5

    // Precio: óptimo entre 15 y 40, penaliza fuera de ese rango
    const price = a.avgAmazonPrice ?? 0;
    let priceScore = 0;
    if (price >= 15 && price <= 40) {
        priceScore = 1;
    } else if (price > 40) {
        priceScore = Math.max(0, 1 - (price - 40) / 40);
    } else if (price > 0) {
        priceScore = Math.max(0, 1 - (15 - price) / 15);
    }

    // Reviews: <300 top (1), 300-500 bien (0.7), 500-1000 tenso (0.4), >1000 (0.1)
    const reviews = a.avgAmazonReviews ?? 0;
    let reviewsScore = 0.1;
    if (reviews < 300) reviewsScore = 1;
    else if (reviews < 500) reviewsScore = 0.7;
    else if (reviews < 1000) reviewsScore = 0.4;

    // Sales volume: más es mejor, normalizado
    const sales = a.totalAmazonSalesVolume ?? 0;
    // El máximo se calculará fuera para normalizar, aquí solo devolvemos el valor

    // Score final: pondera cada factor (ajusta pesos si quieres)
    // El salesScore se normaliza en getTopNiches
    return { ratingScore, priceScore, reviewsScore, sales };
}

function getTopNiches(analytics: NicheAnalytics[], top = 3) {
    // Normaliza salesVolume para todos los nichos
    const maxSales = Math.max(...analytics.map(a => a.totalAmazonSalesVolume ?? 0), 1);
    return [...analytics]
        .map((a) => {
            const { ratingScore, priceScore, reviewsScore, sales } = getProfitScore(a);
            // Ponderación: ventas (0.4), rating (0.2), precio (0.2), reviews (0.2)
            const salesScore = Math.min(1, (sales ?? 0) / maxSales);
            const score = salesScore * 0.4 + ratingScore * 0.2 + priceScore * 0.2 + reviewsScore * 0.2;
            return { ...a, score, ratingScore, priceScore, reviewsScore, salesScore };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, top);
}

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
            icon: <Star className="w-4 h-4 text-yellow-400" />,
            format: (v: number) => v !== undefined ? v.toFixed(2) : "-",
        },
        {
            key: "avgAmazonPrice",
            label: "Avg Price",
            icon: <Tag className="w-4 h-4 text-blue-300" />,
            format: (v: number) => v !== undefined ? `$${v.toFixed(2)}` : "-",
        },
        {
            key: "totalAmazonReviews",
            label: "Reviews",
            icon: <Users className="w-4 h-4 text-green-400" />,
            format: (v: number) => v?.toLocaleString() ?? "-",
        },
        {
            key: "totalAmazonSalesVolume",
            label: "Sales Volume",
            icon: <Package className="w-4 h-4 text-orange-400" />,
            format: (v: number) => v?.toLocaleString() ?? "-",
        },
        {
            key: "uniqueAmazonBrands",
            label: "Brands",
            icon: <BarChart2 className="w-4 h-4 text-purple-400" />,
        },
    ];

function formatValue(metric: typeof TABLE_METRICS[number], value: any) {
    if (metric.format) return metric.format(value);
    if (typeof value === "number") return value.toLocaleString();
    return value ?? "-";
}

export function NicheSearcherDashboard({ analytics }: { analytics: NicheAnalytics[] }) {
    if (!analytics || analytics.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">No analytics to display.</p>
                </CardContent>
            </Card>
        );
    }

    const topNiches = getTopNiches(analytics, 3);
    const maxSales = Math.max(...analytics.map(a => a.totalAmazonSalesVolume ?? 0), 1);

    return (
        <div className="flex flex-col gap-8">
            {/* Top Niches */}
            <section>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" /> Top Niches
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                    {topNiches.map((niche, idx) => (
                        <Card
                            key={niche.keyword}
                            className={cn(
                                "flex-1 min-w-[260px] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-none shadow-md",
                                idx === 0 && "ring-2 ring-amber-400"
                            )}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-gray-800 text-gray-100 px-2 py-1 text-xs font-semibold">
                                        {niche.keyword}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        Saved {new Date(niche.searchedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <CardTitle className="text-base font-bold mt-2 flex items-center gap-2">
                                    <span>
                                        {idx === 0 && "🥇"}
                                        {idx === 1 && "🥈"}
                                        {idx === 2 && "🥉"}
                                    </span>
                                    {niche.topCategory && (
                                        <span className="text-xs text-blue-300 font-medium ml-1">{niche.topCategory}</span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span>
                                        Rating: <span className={niche.avgAmazonRating && niche.avgAmazonRating >= 2 && niche.avgAmazonRating <= 3 ? "text-green-400" : "text-yellow-300"}>
                                            {niche.avgAmazonRating?.toFixed(2) ?? "-"}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Tag className="w-4 h-4 text-blue-300" />
                                    <span>
                                        Price: <span className={niche.avgAmazonPrice && niche.avgAmazonPrice >= 15 && niche.avgAmazonPrice <= 40 ? "text-green-400" : "text-yellow-300"}>
                                            {niche.avgAmazonPrice !== undefined ? `$${niche.avgAmazonPrice.toFixed(2)}` : "-"}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Users className="w-4 h-4 text-green-400" />
                                    <span>
                                        Reviews: <span className={
                                            (niche.totalAmazonReviews ?? 0) < 300
                                                ? "text-green-400"
                                                : (niche.totalAmazonReviews ?? 0) < 500
                                                    ? "text-yellow-300"
                                                    : (niche.totalAmazonReviews ?? 0) < 1000
                                                        ? "text-orange-400"
                                                        : "text-red-400"
                                        }>
                                            {niche.totalAmazonReviews?.toLocaleString() ?? "-"}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Package className="w-4 h-4 text-orange-400" />
                                    <span>
                                        Sales: <span className="text-blue-300">
                                            {niche.totalAmazonSalesVolume?.toLocaleString() ?? "-"}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-muted-foreground">Score:</span>
                                    <span className="font-bold text-green-400">{(niche.score * 100).toFixed(0)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Comparison Table */}
            <section>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-blue-400" /> Compare Niches
                </h2>
                <ScrollArea className="w-full overflow-x-auto rounded-lg border border-gray-800 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
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
                                    <tr key={niche.keyword} className="hover:bg-gray-900/60 transition">
                                        <td className="p-2">
                                            <Badge className="bg-gray-800 text-gray-100 px-2 py-1 text-xs font-semibold">
                                                {niche.keyword}
                                            </Badge>
                                            {niche.topCategory && (
                                                <span className="ml-2 text-xs text-blue-300">{niche.topCategory}</span>
                                            )}
                                        </td>
                                        {TABLE_METRICS.map((metric) => (
                                            <td key={metric.key} className="p-2 text-sm">
                                                {formatValue(metric, niche[metric.key])}
                                            </td>
                                        ))}
                                        <td className="p-2 text-sm font-bold text-green-400">{(niche.score * 100).toFixed(0)}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </ScrollArea>
            </section>

            {/* Visual Analysis */}
            <section>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" /> Visual Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Ratings Bar */}
                    <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 border-none shadow">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-400" /> Avg Rating
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                {analytics.map((niche) => (
                                    <div key={niche.keyword} className="flex items-center gap-2">
                                        <Badge className="bg-gray-800 text-gray-100 px-2 py-1 text-xs font-semibold min-w-[80px]">
                                            {niche.keyword}
                                        </Badge>
                                        <div className="flex-1 h-2 rounded bg-gray-800 overflow-hidden">
                                            <div
                                                className="h-2 rounded bg-yellow-400 transition-all"
                                                style={{
                                                    width: `${((niche.avgAmazonRating ?? 0) / 5) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-200 w-8 text-right">
                                            {niche.avgAmazonRating?.toFixed(2) ?? "-"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    {/* Price Bar */}
                    <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 border-none shadow">
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
                                            <Badge className="bg-gray-800 text-gray-100 px-2 py-1 text-xs font-semibold min-w-[80px]">
                                                {niche.keyword}
                                            </Badge>
                                            <div className="flex-1 h-2 rounded bg-gray-800 overflow-hidden">
                                                <div
                                                    className="h-2 rounded bg-blue-400 transition-all"
                                                    style={{
                                                        width: `${maxPrice ? ((niche.avgAmazonPrice ?? 0) / maxPrice) * 100 : 0}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-200 w-12 text-right">
                                                {niche.avgAmazonPrice !== undefined ? `$${niche.avgAmazonPrice.toFixed(2)}` : "-"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                    {/* Sales Volume Bar */}
                    <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 border-none shadow">
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
                                            <Badge className="bg-gray-800 text-gray-100 px-2 py-1 text-xs font-semibold min-w-[80px]">
                                                {niche.keyword}
                                            </Badge>
                                            <div className="flex-1 h-2 rounded bg-gray-800 overflow-hidden">
                                                <div
                                                    className="h-2 rounded bg-orange-400 transition-all"
                                                    style={{
                                                        width: `${maxSales ? ((niche.totalAmazonSalesVolume ?? 0) / maxSales) * 100 : 0}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-200 w-12 text-right">
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
        </div>
    );
}