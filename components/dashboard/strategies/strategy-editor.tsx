"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Strategy } from "@/types/analytics/strategies";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getColorClass } from "@/lib/functions/strategies/utils";
import { REQUIRED_PARAMS } from "../../../lib/strategies";
import { COLOR_OPTIONS, ICON_OPTIONS } from "./strategies-options";
import { deleteStrategy, upsertStrategy } from "@/services/client/strategies.client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StrategyEditorProps {
    strategy: Strategy;
}

export default function StrategyEditor({ strategy }: StrategyEditorProps) {
    const router = useRouter();

    const [draftStrategy, setDraftStrategy] = useState<Strategy>(strategy);

    function handleParamChange<K extends keyof Strategy>(param: K, value: number) {
        setDraftStrategy((prev) => ({
            ...prev,
            [param]: value,
        }));
    }

    async function handleSaveStrategy(newStrategy: Strategy) {
        if (
            !newStrategy.name ||
            !newStrategy.icon ||
            !newStrategy.color ||
            !newStrategy.description ||
            REQUIRED_PARAMS.some((p) => newStrategy[p] === undefined)
        ) {
            return;
        }
        toast.promise(
            upsertStrategy(newStrategy).then((res) => {
                router.push("/strategies");
                router.refresh();
                return res;
            }),
            {
                loading: "Saving...",
                success: "Strategy saved",
                error: "Error saving strategy",
            }
        );
    }

    function handleIconChange(icon: string) {
        setDraftStrategy((prev) => ({ ...prev, icon }));
    }

    function handleColorChange(color: string) {
        setDraftStrategy((prev) => ({ ...prev, color }));
    }

    function handleDeleteStrategy(strategy: Strategy) {
        toast.promise(
            deleteStrategy(strategy).then((res) => {
                router.push("/strategies");
                router.refresh();
                return res;
            }),
            {
                loading: "Deleting...",
                success: "Strategy deleted",
                error: "Error deleting strategy",
            }
        );
    }

    return (
        <section>
            <Card id="strategy-create-form" className="mb-6 animate-in fade-in">
                <CardHeader>
                    <div className="flex justify-between">
                        <CardTitle>{strategy.id ? "Edit strategy" : "Create new strategy"}</CardTitle>
                        {strategy.id &&
                            <Button
                                variant={"destructive"}
                                onClick={() => handleDeleteStrategy(strategy)}
                            >
                                <Trash2 />
                            </Button>}
                    </div>
                    <CardDescription>
                        Set your own parameters and icon. Required fields are marked.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="strategy-name">Name *</Label>
                            <Input
                                maxLength={15}
                                id="strategy-name"
                                value={draftStrategy.name}
                                onChange={(e) =>
                                    setDraftStrategy((prev) => ({ ...prev, name: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="strategy-icon">Icon *</Label>
                            <div className="flex gap-2 mt-1">
                                {ICON_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={cn(
                                            "cursor-pointer p-2 rounded border transition hover:border-primary",
                                            draftStrategy.icon === opt.value
                                                ? "border-primary bg-primary/10"
                                                : "border-muted"
                                        )}
                                        id={`icon-${opt.value}`}
                                        aria-label={opt.label}
                                        onClick={() => handleIconChange(opt.value)}
                                    >
                                        {opt.icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="strategy-color">Color *</Label>
                            <div className="flex gap-2 mt-1 flex-wrap">
                                {COLOR_OPTIONS.map((color) => (
                                    <Button
                                        className={cn("h-3 w-4 hover:bg-color-none",
                                            getColorClass(color.value),
                                            draftStrategy.color === color.value
                                                ? "ring-2 ring-primary border-primary"
                                                : "border-muted"
                                        )}
                                        aria-label={color.name}
                                        onClick={() => handleColorChange(color.value)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="strategy-description">Description *</Label>
                        <Input
                            id="strategy-description"
                            value={draftStrategy.description}
                            onChange={(e) =>
                                setDraftStrategy((prev) => ({ ...prev, description: e.target.value }))
                            }
                            required
                        />
                    </div>
                    <Separator className="my-6" />
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                            <Label htmlFor="sales-volume-optimum">Sales volume optimum *</Label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        tabIndex={0}
                                        aria-label="What is the sales volume optimum?"
                                        className="ml-1 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                                    >
                                        <HelpCircle className="w-4 h-4" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={4}>
                                    <p>
                                        Ideal number of items sold per month for a product in this niche. For example, set to 300 if you want to prioritize niches where products sell about 300 units/month.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Input
                            id="sales-volume-optimum"
                            type="number"
                            min={0}
                            value={draftStrategy.salesVolumeOptimum}
                            onChange={(e) => handleParamChange("salesVolumeOptimum", parseFloat(e.target.value))}
                            placeholder="e.g. 300"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Rating Optimum with tooltip */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <Label htmlFor="rating-optimum">Rating optimum *</Label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            tabIndex={0}
                                            aria-label="What is the rating optimum?"
                                            className="ml-1 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                                        >
                                            <HelpCircle className="w-4 h-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={4}>
                                        Ideal average rating for the niche (1-5).
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Input
                                id="rating-optimum"
                                type="number"
                                min={1}
                                max={5}
                                step={0.1}
                                value={draftStrategy.ratingOptimum}
                                onChange={(e) => handleParamChange("ratingOptimum", parseFloat(e.target.value))}
                            />
                        </div>
                        {/* Price min/max grouped */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <Label>Price range *</Label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            tabIndex={0}
                                            aria-label="What is the price range?"
                                            className="ml-1 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                                        >
                                            <HelpCircle className="w-4 h-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={4}>
                                        Target price range for products in the niche. 
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    value={draftStrategy.priceMin}
                                    onChange={(e) => handleParamChange("priceMin", parseFloat(e.target.value))}
                                    aria-label="Min price"
                                    placeholder="Min"
                                />
                                <span className="self-center text-muted-foreground">-</span>
                                <Input
                                    type="number"
                                    min={0}
                                    value={draftStrategy.priceMax}
                                    onChange={(e) => handleParamChange("priceMax", parseFloat(e.target.value))}
                                    aria-label="Max price"
                                    placeholder="Max"
                                />
                            </div>
                        </div>
                        {/* Reviews grouped */}
                        <div className="flex flex-col md:col-span-2 gap-1">
                            <div className="flex items-center gap-1">
                                <Label>Reviews thresholds *</Label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            tabIndex={0}
                                            aria-label="What are review thresholds?"
                                            className="ml-1 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                                        >
                                            <HelpCircle className="w-4 h-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={4}>
                                        Set the review count limits to classify competition: Top (low), Good (medium), Tense (high).
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2">
                                <div className="flex-1 flex flex-col items-center">
                                    <Input
                                        type="number"
                                        min={0}
                                        value={draftStrategy.reviewsTop}
                                        onChange={(e) => handleParamChange("reviewsTop", parseFloat(e.target.value))}
                                        aria-label="Top reviews"
                                        placeholder="Top"
                                    />
                                    <span className="block text-xs text-muted-foreground mt-1">
                                        Top Reviews
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col items-center">
                                    <Input
                                        type="number"
                                        min={0}
                                        value={draftStrategy.reviewsGood}
                                        onChange={(e) => handleParamChange("reviewsGood", parseFloat(e.target.value))}
                                        aria-label="Good reviews"
                                        placeholder="Good"
                                    />
                                    <span className="block text-xs text-muted-foreground mt-1">
                                        Good Reviews
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col items-center">
                                    <Input
                                        type="number"
                                        min={0}
                                        value={draftStrategy.reviewsTense}
                                        onChange={(e) => handleParamChange("reviewsTense", parseFloat(e.target.value))}
                                        aria-label="Tense reviews"
                                        placeholder="Tense"
                                    />
                                    <span className="block text-xs text-muted-foreground mt-1">
                                        Tense Reviews
                                    </span>
                                </div>
                            </div>
                            <Separator className="my-6" />
                            {/* Weights grouped and UX improved */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-1">
                                    <Label>Weights *</Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                type="button"
                                                tabIndex={0}
                                                aria-label="How do weights work?"
                                                className="ml-1 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                                            >
                                                <HelpCircle className="w-4 h-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent sideOffset={4}>
                                            Weights determine the relative importance of each factor (sales, rating, price, reviews) in the final score. They should add up to 1.
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <div className="flex-1 flex flex-col items-center">
                                        <Input
                                            type="range"
                                            min={0}
                                            max={1}
                                            step={0.10}
                                            value={draftStrategy.salesWeight}
                                            onChange={(e) => handleParamChange("salesWeight", parseFloat(e.target.value))}
                                            aria-label="Sales weight"
                                            className="w-full"
                                        />
                                        <span className="block text-xs text-muted-foreground mt-1">
                                            Sales: <span className="font-semibold">{draftStrategy.salesWeight}</span>
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <Input
                                            type="range"
                                            min={0}
                                            max={1}
                                            step={0.10}
                                            value={draftStrategy.ratingWeight}
                                            onChange={(e) => handleParamChange("ratingWeight", parseFloat(e.target.value))}
                                            aria-label="Rating weight"
                                            className="w-full"
                                        />
                                        <span className="block text-xs text-muted-foreground mt-1">
                                            Rating: <span className="font-semibold">{draftStrategy.ratingWeight}</span>
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <Input
                                            type="range"
                                            min={0}
                                            max={1}
                                            step={0.10}
                                            value={draftStrategy.priceWeight}
                                            onChange={(e) => handleParamChange("priceWeight", parseFloat(e.target.value))}
                                            aria-label="Price weight"
                                            className="w-full"
                                        />
                                        <span className="block text-xs text-muted-foreground mt-1">
                                            Price: <span className="font-semibold">{draftStrategy.priceWeight}</span>
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <Input
                                            type="range"
                                            min={0}
                                            max={1}
                                            step={0.10}
                                            value={draftStrategy.reviewsWeight}
                                            onChange={(e) => handleParamChange("reviewsWeight", parseFloat(e.target.value))}
                                            aria-label="Reviews weight"
                                            className="w-full"
                                        />
                                        <span className="block text-xs text-muted-foreground mt-1">
                                            Reviews: <span className="font-semibold">{draftStrategy.reviewsWeight}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground mt-2 text-right">
                                    <span
                                        className={cn(
                                            "font-semibold",
                                            Math.abs(
                                                draftStrategy.salesWeight +
                                                draftStrategy.ratingWeight +
                                                draftStrategy.priceWeight +
                                                draftStrategy.reviewsWeight -
                                                1
                                            ) > 0.01
                                                ? "text-red-500"
                                                : "text-green-500"
                                        )}
                                    >
                                        Total:{" "}
                                        {(
                                            draftStrategy.salesWeight +
                                            draftStrategy.ratingWeight +
                                            draftStrategy.priceWeight +
                                            draftStrategy.reviewsWeight
                                        ).toFixed(2)}
                                    </span>{" "}
                                    (should be 1)
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button
                                onClick={() => handleSaveStrategy(draftStrategy)}
                                disabled={
                                    !draftStrategy.name ||
                                    !draftStrategy.icon ||
                                    !draftStrategy.color ||
                                    !draftStrategy.description ||
                                    REQUIRED_PARAMS.some((p) => draftStrategy[p] === undefined)
                                }
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}