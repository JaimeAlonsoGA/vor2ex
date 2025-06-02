import StrategyEditor from "@/components/dashboard/strategies/strategy-editor";
import { getStrategiesAction } from "@/lib/actions/strategies-actions";
import { EMPTY_STRATEGY } from "@/lib/strategies";
import { Suspense } from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CreateStrategyPage({ params }: PageProps) {
    const { id } = await params;
    const userStrategies = await getStrategiesAction();
    const strategy = id === "create"
        ? EMPTY_STRATEGY
        : userStrategies.find((s) => s.id === id) ?? EMPTY_STRATEGY;

    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <StrategyEditor strategy={strategy} />
        </Suspense>
    );
}