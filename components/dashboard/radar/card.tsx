import { getIconComponent } from "@/components/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBorderClass } from "@/lib/functions/strategies/utils";
import { cn } from "@/lib/utils";
import { Niche } from "@/types/niche";
import { Strategy } from "@/types/strategies";
import { Component, Package, Star, Tag, Users } from "lucide-react";
import SaveNicheButton from "../save-niche-button";

type OpportunityCardProps = {
    niche: Niche;
    strategy: Strategy;
    score: number;
    userNiches: Niche[];
    onSelectAnalytics: (niche: Niche) => void;
};


export default function OpportunityCard({ niche, strategy, score, onSelectAnalytics, userNiches }: OpportunityCardProps) {
    return (
        <Card
            className={cn(
                "hover:bg-muted/20 flex flex-row items-center gap-4 p-6 transition-all duration-500",
            )}
        >
            <div className="flex flex-col items-center justify-center gap-2">
                <div className={cn("border", getBorderClass(strategy.color), "p-2 rounded-full")}>
                    {getIconComponent(strategy.icon, "w-6 h-6 text-primary")}
                </div>
                <Badge variant="outline">{strategy.name}</Badge>
            </div>
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{niche.keyword}</span>
                    {niche.topCategory && (
                        <span className="text-xs text-blue-500">{niche.topCategory}</span>
                    )}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {niche.avgAmazonRating?.toFixed(2) ?? "-"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4 text-blue-400" />
                        {niche.avgAmazonPrice !== undefined ? `$${niche.avgAmazonPrice.toFixed(2)}` : "-"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-green-400" />
                        {niche.avgAmazonReviews?.toLocaleString() ?? "-"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-orange-400" />
                        {niche.totalAmazonSalesVolume?.toLocaleString() ?? "-"}
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-end min-w-[70px]">
                <span className={cn(
                    "font-bold text-lg",
                    score >= 70 ? "text-green-600" : score >= 40 ? "text-yellow-500" : "text-red-500"
                )}>
                    {score}
                </span>
                <span className="text-xs text-muted-foreground">Score</span>
            </div>
            <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectAnalytics(niche)}
                aria-label={`Show analytics for ${niche.keyword}`}
            >
                <Component className="w-4 h-4" />
                Analytics
            </Button>
            <SaveNicheButton
                term={niche.keyword}
                savedNiches={userNiches.map(n => n.keyword)}
                initialPromise={Promise.resolve()}
                variant="long"
            />
        </Card>
    );
}