"use client";

import { use, useEffect, useState } from "react";
import { Niche } from "@/types/niche";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD_HEIGHT, CARD_WIDTH, CardBody, CardConfig, DEFAULT_PINNED, getCardsConfig, renderCard } from "./cards";
import { AmazonProductsFactoryResponse } from "@/types/amazon/amazon-factory";
import { AlibabaProductsFactoryResponse } from "@/types/alibaba/alibaba-factory";
import { getNiche } from "@/lib/factories/niche-item";

interface OverviewSectionProps {
    term?: string;
    marketplace?: string;
    amazonProductsPromise: Promise<AmazonProductsFactoryResponse>;
    alibabaProductsPromise: Promise<AlibabaProductsFactoryResponse>;
}

export function OverviewSection({ term, marketplace, amazonProductsPromise, alibabaProductsPromise }: OverviewSectionProps) {
    const [niche, setNiche] = useState<Niche | undefined>(undefined);
    const amazonProducts = use(amazonProductsPromise);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!term || !amazonProducts.products || !marketplace) {
            setNiche(undefined);
            return;
        }
        setNiche(getNiche(term, marketplace, amazonProducts));
    }, [amazonProducts]);

    useEffect(() => {
        let cancelled = false;
        alibabaProductsPromise.then(alibabaProducts => {
            if (!cancelled && term && marketplace && alibabaProducts.products && alibabaProducts.products.length > 0) {
                setNiche(getNiche(term, marketplace, amazonProducts, alibabaProducts));
            }
        });
        return () => { cancelled = true; };
    }, [alibabaProductsPromise, amazonProducts]);

    return (
        <section aria-label="Quick niche overview" className="w-full">
            {/* Featured section (pinned) */}
            <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Featured</span>
                    <div className="flex-1 border-t border-dashed border-muted" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {DEFAULT_PINNED.map(key => renderCard(getCardsConfig(niche).find(c => c.key === key)!, "pinned"))}
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
                {getCardsConfig(niche)
                    .filter(card => !DEFAULT_PINNED.includes(card.key))
                    .map(card => renderCard(card, "other"))}
            </div>
            <div className={`flex justify-center gap-2 ${expanded ? "mt-4" : ""}`}>
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
            </div>
        </section>
    );
}

export default OverviewSection;