"use client";

import { Button } from "@/components/ui/button"
import { toggleStrategySelection } from "@/services/client/strategies.client";
import { Strategy } from "@/types/strategies";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";

export const UseStrategy = ({ strategy }: { strategy: Strategy }) => {
    const router = useRouter();

    const handleUseStrategy = (strategy: Strategy, newState: boolean) => {
        toast.promise(toggleStrategySelection(strategy.id!, newState), {
            loading: `${newState ? `Applying strategy...` : `Revoking strategy...`}`,
            success: `${newState ? `Analyzing with ${strategy.name} strategy` : `Desactivated ${strategy.name} strategy`}`,
            error: "Error configuring strategy.",
        });
        router.refresh();
    };

    return (
        <Button
            variant={strategy.selected ? "default" : "outline"}
            onClick={() => handleUseStrategy(strategy, !strategy.selected)}>
            <span>{strategy.selected ? "Desactivate" : "Activate"}</span>
        </Button>
    )
}