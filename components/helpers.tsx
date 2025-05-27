import { Sigma } from "lucide-react";
import { ICON_OPTIONS } from "./dashboard/strategies/strategies-options";
import React from "react";

export function getIconComponent(icon: string, className?: string) {
    if (!icon) return <Sigma className={className} />;
    const i = ICON_OPTIONS.find((i) => i.value === icon)?.icon ?? <Sigma className={className} />;
    return React.cloneElement(i, { className });
}

export function getIconElement(icon: string, className?: string): React.ReactElement {
    if (!icon) return <Sigma className={className} />;
    const i = ICON_OPTIONS.find((i) => i.value === icon)?.icon ?? <Sigma className={className} />;
    return i;
}