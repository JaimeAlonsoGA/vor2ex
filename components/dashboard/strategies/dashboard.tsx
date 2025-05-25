"use client";

import { useState } from "react";
import { Note } from "@/components/note";
import { Button } from "@/components/ui/button";
import { DraftingCompass, SquarePen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { deleteStrategy, insertOrUpdateStrategy } from "@/services/client/strategies.client";
import { dbToStrategy } from "@/lib/factories/strategy-item";
import { Strategy } from "@/types/analytics/strategies";
import { EMPTY_STRATEGY, REQUIRED_PARAMS } from "../../../lib/strategies";
import { getBorderClass } from "@/lib/functions/strategies/utils";
import { StrategyEditor } from "./strategy-editor";
import { getIconComponent } from "@/components/helpers";

export default function StrategiesDashboard({ userStrategies }: { userStrategies?: Strategy[] }) {
    const [strategies, setStrategies] = useState<Strategy[]>(userStrategies || []);
    const [tab, setTab] = useState<"create" | "my">("my");
    const [creating, setCreating] = useState(false);
    const [newStrategy, setNewStrategy] = useState<Strategy>(EMPTY_STRATEGY);

    function handleIconChange(icon: string) {
        setNewStrategy((prev) => ({ ...prev, icon }));
    }

    function handleColorChange(color: string) {
        setNewStrategy((prev) => ({ ...prev, color }));
    }


    function handleParamChange<K extends keyof Strategy>(param: K, value: number) {
        setNewStrategy((prev) => ({
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
            insertOrUpdateStrategy(newStrategy).then((res) => {
                if (res) {
                    const refinedStrategy = dbToStrategy(res);
                    if (!newStrategy.id) {
                        setStrategies((prev) => [...prev, refinedStrategy]);
                    } else {
                        setStrategies((prev) =>
                            prev.map((s) => (s.id === res.id ? { ...s, ...refinedStrategy } : s))
                        );
                    }
                }
                return res;
            }),
            {
                loading: "Saving...",
                success: "Strategy saved",
                error: "Error saving strategy",
            }
        );
        setNewStrategy(EMPTY_STRATEGY);
        setTab("my");
        setCreating(false);
    }

    function handleEditStrategy(strategy: Strategy) {
        if (strategies.some((s) => s === strategy)) {
            setNewStrategy(strategy);
            setTab("create");
            setCreating(true);
        } else toast("Strategy not found");
    }

    function handleDeleteStrategy(strategy: Strategy) {
        toast.promise(
            deleteStrategy(strategy).then((res) => {
                if (res?.success) {
                    setStrategies(
                        (prev) => prev.filter((s) => s.id !== strategy.id)
                    );
                }
                return res;
            }),
            {
                loading: "Saving...",
                success: "Strategy saved",
                error: "Error saving strategy",
            }
        );
        setNewStrategy(EMPTY_STRATEGY);
        setTab("my");
        setCreating(false);
    }

    return (
        <main className="space-y-8">
            <Note
                note="Configure your strategies to personalize how Vor2ex analyzes and scores each niche. Strategies let you adapt the analytics to your business style."
                to="/help"
                toMessage="Learn more"
            />
            <Tabs value={tab} onValueChange={v => setTab(v as "create" | "my")}>
                <TabsList className="mb-6">
                    <TabsTrigger value="my">My strategies</TabsTrigger>
                    <TabsTrigger value="create">Create strategy</TabsTrigger>
                </TabsList>
                <TabsContent value="my">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <DraftingCompass className="w-6 h-6" />
                                Strategies
                            </h1>
                            <Button
                                variant="secondary"
                                onClick={() => { setTab("create"); setCreating(true); }}
                                aria-expanded={creating}
                                aria-controls="strategy-create-form"
                            >
                                <span className="sr-only">Add strategy</span>
                                +
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {strategies.map((strategy, idx) => {
                                const Icon = getIconComponent(strategy.icon);
                                return (
                                    <Card key={strategy.id ?? strategy.name + idx} className="relative group">
                                        <CardHeader>
                                            <div className="flex items-center gap-2 justify-between">
                                                <CardTitle className="flex gap-2 items-center">
                                                    <span className={cn("rounded-full p-2 border", getBorderClass(strategy.color))}>{Icon}</span>                                                        {strategy.name}
                                                </CardTitle>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="ml-2"
                                                    aria-label="Edit strategy"
                                                    onClick={() => handleEditStrategy(strategy)}
                                                >
                                                    <SquarePen className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <CardDescription>{strategy.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <span className="font-semibold">Rating optimum:</span> {strategy.ratingOptimum}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Price:</span> ${strategy.priceMin} - ${strategy.priceMax}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Reviews:</span> Top &lt; {strategy.reviewsTop}, Good &lt; {strategy.reviewsGood}, Tense &lt; {strategy.reviewsTense}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Weights:</span>
                                                    <span className="ml-1">
                                                        Sales {strategy.salesWeight}, Rating {strategy.ratingWeight}, Price {strategy.priceWeight}, Reviews {strategy.reviewsWeight}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>
                </TabsContent>
                <TabsContent value="create">
                    <StrategyEditor strategy={newStrategy} setStrategy={setNewStrategy} onColorChange={handleColorChange} onIconChange={handleIconChange} onParamChange={handleParamChange} onSave={handleSaveStrategy} onDelete={handleDeleteStrategy} />
                </TabsContent>
            </Tabs>
        </main >
    );
}