import { Note } from "@/components/note";
import { Button } from "@/components/ui/button";
import { DraftingCompass, Plus, SquarePen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Strategy } from "@/types/analytics/strategies";
import { getBorderClass } from "@/lib/functions/strategies/utils";
import { getIconElement } from "@/components/helpers";
import Link from "next/link";
import { UseStrategy } from "./use-strategy";

export default function StrategiesDashboard({ strategies }: { strategies: Strategy[] }) {
    return (
        <main className="space-y-8">
            <Note
                note="Define your strategies to configure how Vor2ex analyzes and scores each niche. Strategies let you adapt the analytics to your business style."
                to="/help"
                toMessage="Learn more"
            />
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <DraftingCompass className="w-6 h-6" />
                        Strategies
                    </h1>
                    <Button variant={"outline"} asChild>
                        <Link href="/strategies/create">
                            <Plus className="w-5 h-5" />
                            <span>Create strategy</span>
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {strategies.map((strategy, idx) => {
                        const Icon = getIconElement(strategy.icon);
                        const borderClass = getBorderClass(strategy.color);
                        return (
                            <Card key={strategy.id ?? strategy.name + idx} className={`relative group ${strategy.selected && borderClass}`}>
                                <CardHeader>
                                    <div className="flex items-center gap-2 justify-between">
                                        <CardTitle className="flex gap-2 items-center">
                                            <span className={cn("rounded-full p-2 border", borderClass)}>{Icon}</span>                                                        {strategy.name}
                                        </CardTitle>
                                        <Link
                                            href={`/strategies/${strategy.id}`}
                                        >
                                            <SquarePen className="w-4 h-4" />
                                        </Link>
                                    </div>
                                    <CardDescription>{strategy.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="font-semibold">Sales Volume:</span>{strategy.salesVolumeOptimum}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Rating optimum:</span> {strategy.ratingOptimum}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Reviews:</span> Top &lt; {strategy.reviewsTop}, Good &lt; {strategy.reviewsGood}, Tense &lt; {strategy.reviewsTense}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Weights:</span> Sales {strategy.salesWeight}, Rating {strategy.ratingWeight}, Price {strategy.priceWeight}, Reviews {strategy.reviewsWeight}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Price:</span> ${strategy.priceMin} - ${strategy.priceMax}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <UseStrategy strategy={strategy} />
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </section>
        </main >
    );
}