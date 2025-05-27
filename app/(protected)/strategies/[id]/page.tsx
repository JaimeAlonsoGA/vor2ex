import StrategyEditor from "@/components/dashboard/strategies/strategy-editor";
import { collectUserStrategiesData } from "@/lib/functions/strategies/collect-strategies-data";
import { EMPTY_STRATEGY } from "@/lib/strategies";
import { Suspense } from "react";

interface PageProps {
    params: { id: string };
}

export default async function CreateStrategyPage({ params }: PageProps) {
    const { id } = await params;
    const userStrategies = await collectUserStrategiesData();
    const strategy = id === "create"
        ? EMPTY_STRATEGY
        : userStrategies.find((s) => s.id === id) ?? EMPTY_STRATEGY;

    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <StrategyEditor strategy={strategy} />
        </Suspense>
    );
}