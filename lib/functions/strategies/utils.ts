import { COLOR_OPTIONS } from "@/components/dashboard/strategies/strategies-options";
import { Sigma } from "lucide-react";

export function getColorClass(color: string) {
    return COLOR_OPTIONS.find((c) => c.value === color)?.class || "bg-blue-500";
}

export function getColorValue(color: string) {
    return COLOR_OPTIONS.find((c) => c.value === color)?.value || "blue-500";
}

export function getBorderClass(color: string) {
    return COLOR_OPTIONS.find((c) => c.value === color)?.border || "border-blue-500";
}