"use client";

import { NicheAnalytics } from "@/types/analytics/analytics";
import React, { useState } from "react";
import { Note } from "@/components/note";
import { AnalyticsTable } from "./analytics-table";
import { TopNichesAnalytics } from "./top-niches";
import { AnalyticsMetrics } from "./metrics";
import { Strategy } from "@/types/analytics/strategies";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { getIconComponent } from "@/components/helpers";
import { getBorderClass } from "@/lib/functions/strategies/utils";
import { Badge } from "@/components/ui/badge";
import { DraftingCompass, ChevronDown, Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NicheSearcherDashboard({
    analytics,
    strategies,
}: { analytics: NicheAnalytics[], strategies: Strategy[] }) {
    const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>(strategies.map(s => s.id!));

    // Helper: get selected strategies
    const selectedStrategies = strategies.filter(
        (s) => s.id && selectedStrategyIds.includes(s.id)
    );

    // Handler for toggling strategies
    function handleToggleStrategy(id: string) {
        setSelectedStrategyIds((prev) =>
            prev.includes(id)
                ? prev.filter((sid) => sid !== id)
                : [...prev, id]
        );
    }

    return (
        <div className="space-y-6">
            <Note note="Save niches on the Product Searcher to analyse them in bulk here" to="/product-searcher" toMessage="Product Searcher" />
            <Card className="mb-2">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <DraftingCompass className="inline w-5 h-5 mr-2" />
                        <span>Strategies</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="cursor-pointer">
                                <button
                                    className={cn(
                                        "ml-2 flex items-center gap-1 px-2 py-1 rounded-md border border-muted bg-muted hover:bg-muted/70 transition text-sm font-medium",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    )}
                                    aria-label="Select strategies"
                                    type="button"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                    Select strategies
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="min-w-[220px] max-h-72 overflow-y-auto">
                                {strategies.map((strategy) => {
                                    const icon = getIconComponent(strategy.icon);
                                    return (
                                        <>
                                            <DropdownMenuCheckboxItem
                                                key={strategy.id ?? strategy.name}
                                                checked={selectedStrategyIds.includes(strategy.id!)}
                                                onCheckedChange={() => strategy.id && handleToggleStrategy(strategy.id)}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <span className="mr-2">{icon}</span>
                                                <span className="truncate">{strategy.name}</span>
                                            </DropdownMenuCheckboxItem>
                                        </>
                                    );
                                })}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <Link href="/strategies" className="flex items-center gap-2 w-full">
                                        <Plus className="w-4 h-4 mr-2" />
                                        <span className="truncate">Create new strategy</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedStrategies.length === 0 && (
                            <div className="col-span-full text-muted-foreground text-center py-8">
                                <span className="text-sm">No strategies selected. Use the dropdown above to add strategies.</span>
                            </div>
                        )}
                        {selectedStrategies.map((strategy) => {
                            const icon = getIconComponent(strategy.icon);
                            const borderColor = getBorderClass(strategy.color);
                            const selected = selectedStrategyIds.includes(strategy.id!);

                            return (
                                <button
                                    type="button"
                                    key={strategy.id ?? strategy.name}
                                    onClick={() => strategy.id && handleToggleStrategy(strategy.id)}
                                    className={cn(
                                        "group relative flex flex-col items-start rounded-xl border shadow-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                                        "p-4 cursor-pointer text-left bg-background",
                                        borderColor,
                                        selected
                                            ? "ring-2 ring-primary border-primary bg-primary/5 scale-[1.025] shadow-lg"
                                            : "hover:border-primary/60 hover:bg-muted/50"
                                    )}
                                    aria-pressed={selected}
                                    tabIndex={0}
                                >
                                    <div className="flex items-center gap-3 mb-2 w-full">
                                        <span
                                            className={cn(
                                                "rounded-full border-2 p-2 flex items-center justify-center transition-all",
                                                borderColor,
                                                selected ? "bg-primary text-primary-foreground border-primary shadow" : "bg-muted"
                                            )}
                                            aria-hidden="true"
                                        >
                                            {icon}
                                        </span>
                                        <span className="font-semibold text-base truncate">{strategy.name}</span>
                                    </div>
                                    <CardDescription className="mb-2 text-xs text-muted-foreground line-clamp-2">
                                        {strategy.description}
                                    </CardDescription>
                                    <Checkbox
                                        checked={selected}
                                        tabIndex={-1}
                                        className={cn(
                                            "absolute top-3 right-3 pointer-events-none scale-110 transition-all",
                                            selected ? "opacity-100" : "opacity-60"
                                        )}
                                        aria-label={selected ? "Deselect strategy" : "Select strategy"}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
            {/* Top Niches */}
            {/* <TopNichesAnalytics analytics={analytics} strategies={selectedStrategies.length > 0 ? selectedStrategies : strategies} /> */}
            {/* Comparison Table */}
            {/* <AnalyticsTable analytics={analytics} strategies={selectedStrategies.length > 0 ? selectedStrategies : strategies} /> */}
            {/* Visual Analysis */}
            {/* <AnalyticsMetrics analytics={analytics} strategies={selectedStrategies.length > 0 ? selectedStrategies : strategies} /> */}
        </div>
    );
}