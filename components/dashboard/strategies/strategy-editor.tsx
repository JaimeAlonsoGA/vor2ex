import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Strategy } from "@/types/analytics/strategies";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetStateAction } from "react";
import { getColorClass } from "@/lib/functions/strategies/utils";
import { REQUIRED_PARAMS } from "../../../lib/strategies";
import { COLOR_OPTIONS, ICON_OPTIONS } from "./strategies-options";

interface StrategyEditorProps {
    strategy: Strategy;
    onSave: (s: Strategy) => void;
    onIconChange: (i: string) => void;
    onParamChange: <K extends keyof Strategy>(param: K, value: number) => void;
    onColorChange: (c: string) => void;
    setStrategy: (value: SetStateAction<Strategy>) => void;
    onDelete: (s: Strategy) => void;
}

export function StrategyEditor({ strategy, onSave, onIconChange, onParamChange, onColorChange, setStrategy, onDelete }: StrategyEditorProps) {
    return (
        <section>
            <Card id="strategy-create-form" className="mb-6 animate-in fade-in">
                <CardHeader>
                    <div className="flex justify-between">
                        <CardTitle>{strategy.id ? "Edit strategy" : "Create new strategy"}</CardTitle>
                        {strategy.id &&
                            <Button
                                variant={"destructive"}
                                onClick={() => onDelete(strategy)}
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
                                id="strategy-name"
                                value={strategy.name}
                                onChange={(e) =>
                                    setStrategy((prev) => ({ ...prev, name: e.target.value }))
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
                                            strategy.icon === opt.value
                                                ? "border-primary bg-primary/10"
                                                : "border-muted"
                                        )}
                                        id={`icon-${opt.value}`}
                                        aria-label={opt.label}
                                        onClick={() => onIconChange(opt.value)}
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
                                    <button
                                        key={color.value}
                                        type="button"
                                        className={cn(
                                            "cursor-pointer w-7 h-4 rounded-md border transition focus:outline-none focus:ring-2 focus:ring-primary",
                                            getColorClass(color.value),
                                            strategy.color === color.value
                                                ? "ring-2 ring-primary border-primary"
                                                : "border-muted"
                                        )}
                                        aria-label={color.name}
                                        onClick={() => onColorChange(color.value)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="strategy-description">Description *</Label>
                        <Input
                            id="strategy-description"
                            value={strategy.description}
                            onChange={(e) =>
                                setStrategy((prev) => ({ ...prev, description: e.target.value }))
                            }
                            required
                        />
                    </div>
                    <Separator className="my-6" />
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
                                        Ideal average rating for the niche (1-5). Used as a reference for quality scoring.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Input
                                id="rating-optimum"
                                type="number"
                                min={1}
                                max={5}
                                step={0.1}
                                value={strategy.ratingOptimum}
                                onChange={(e) => onParamChange("ratingOptimum", parseFloat(e.target.value))}
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
                                    value={strategy.priceMin}
                                    onChange={(e) => onParamChange("priceMin", parseFloat(e.target.value))}
                                    aria-label="Min price"
                                    placeholder="Min"
                                />
                                <span className="self-center text-muted-foreground">-</span>
                                <Input
                                    type="number"
                                    min={0}
                                    value={strategy.priceMax}
                                    onChange={(e) => onParamChange("priceMax", parseFloat(e.target.value))}
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
                                        value={strategy.reviewsTop}
                                        onChange={(e) => onParamChange("reviewsTop", parseFloat(e.target.value))}
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
                                        value={strategy.reviewsGood}
                                        onChange={(e) => onParamChange("reviewsGood", parseFloat(e.target.value))}
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
                                        value={strategy.reviewsTense}
                                        onChange={(e) => onParamChange("reviewsTense", parseFloat(e.target.value))}
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
                                            step={0.01}
                                            value={strategy.salesWeight}
                                            onChange={(e) => onParamChange("salesWeight", parseFloat(e.target.value))}
                                            aria-label="Sales weight"
                                            className="w-full"
                                        />
                                        <span className="block text-xs text-muted-foreground mt-1">
                                            Sales: <span className="font-semibold">{strategy.salesWeight}</span>
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <Input
                                            type="range"
                                            min={0}
                                            max={1}
                                            step={0.01}
                                            value={strategy.ratingWeight}
                                            onChange={(e) => onParamChange("ratingWeight", parseFloat(e.target.value))}
                                            aria-label="Rating weight"
                                            className="w-full"
                                        />
                                        <span className="block text-xs text-muted-foreground mt-1">
                                            Rating: <span className="font-semibold">{strategy.ratingWeight}</span>
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <Input
                                            type="range"
                                            min={0}
                                            max={1}
                                            step={0.01}
                                            value={strategy.priceWeight}
                                            onChange={(e) => onParamChange("priceWeight", parseFloat(e.target.value))}
                                            aria-label="Price weight"
                                            className="w-full"
                                        />
                                        <span className="block text-xs text-muted-foreground mt-1">
                                            Price: <span className="font-semibold">{strategy.priceWeight}</span>
                                        </span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <Input
                                            type="range"
                                            min={0}
                                            max={1}
                                            step={0.01}
                                            value={strategy.reviewsWeight}
                                            onChange={(e) => onParamChange("reviewsWeight", parseFloat(e.target.value))}
                                            aria-label="Reviews weight"
                                            className="w-full"
                                        />
                                        <span className="block text-xs text-muted-foreground mt-1">
                                            Reviews: <span className="font-semibold">{strategy.reviewsWeight}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground mt-2 text-right">
                                    <span
                                        className={cn(
                                            "font-semibold",
                                            Math.abs(
                                                strategy.salesWeight +
                                                strategy.ratingWeight +
                                                strategy.priceWeight +
                                                strategy.reviewsWeight -
                                                1
                                            ) > 0.01
                                                ? "text-red-500"
                                                : "text-green-500"
                                        )}
                                    >
                                        Total:{" "}
                                        {(
                                            strategy.salesWeight +
                                            strategy.ratingWeight +
                                            strategy.priceWeight +
                                            strategy.reviewsWeight
                                        ).toFixed(2)}
                                    </span>{" "}
                                    (should be 1)
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button
                                onClick={() => onSave(strategy)}
                                disabled={
                                    !strategy.name ||
                                    !strategy.icon ||
                                    !strategy.color ||
                                    !strategy.description ||
                                    REQUIRED_PARAMS.some((p) => strategy[p] === undefined)
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