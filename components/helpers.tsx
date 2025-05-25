import { Sigma } from "lucide-react";
import { ICON_OPTIONS } from "./dashboard/strategies/strategies-options";

export function getIconComponent(icon: string) {
    return ICON_OPTIONS.find((i) => i.value === icon)?.icon ?? <Sigma className="w-5 h-5" />;
}