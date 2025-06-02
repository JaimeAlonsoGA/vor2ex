"use client";

import { useState } from "react";
import { Niche } from "@/types/niche";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD_HEIGHT, CARD_WIDTH, CardBody, CardConfig, DEFAULT_PINNED, getCardsConfig } from "./cards";

interface NicheQuickOverviewProps {
    niche?: Niche;
}

export function OverviewSection({ niche }: NicheQuickOverviewProps) {
    const cardsConfig = getCardsConfig(niche);
    const [pinned, setPinned] = useState<string[]>(DEFAULT_PINNED);
    const [order, setOrder] = useState<string[]>(cardsConfig.map(card => card.key).filter(k => !DEFAULT_PINNED.includes(k)));
    const [dragged, setDragged] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [expanded, setExpanded] = useState(false);

    function handleDragStart(key: string) { setDragged(key); }
    function handleDragEnter(overKey: string) { setDragOver(overKey); }
    function handleDragEnd() { setDragged(null); setDragOver(null); }
    function handleDrop(overKey: string, section: "pinned" | "other") {
        if (!dragged || dragged === overKey) { setDragged(null); setDragOver(null); return; }
        if (section === "pinned") {
            const fromIdx = pinned.indexOf(dragged);
            const toIdx = pinned.indexOf(overKey);
            if (fromIdx === -1 || toIdx === -1) return;
            const newPinned = [...pinned];
            newPinned.splice(fromIdx, 1);
            newPinned.splice(toIdx, 0, dragged);
            setPinned(newPinned);
        } else {
            const fromIdx = order.indexOf(dragged);
            const toIdx = order.indexOf(overKey);
            if (fromIdx === -1 || toIdx === -1) return;
            const newOrder = [...order];
            newOrder.splice(fromIdx, 1);
            newOrder.splice(toIdx, 0, dragged);
            setOrder(newOrder);
        }
        setDragged(null); setDragOver(null);
    }
    function moveCard(key: string, from: "pinned" | "other", to: "pinned" | "other") {
        if (from === to) return;
        if (from === "pinned") {
            setPinned(pinned => pinned.filter(k => k !== key));
            setOrder(order => [key, ...order]);
        } else {
            setOrder(order => order.filter(k => k !== key));
            setPinned(pinned => [...pinned, key]);
        }
    }

    const editCardClass =
        "shadow-xl ring-2 ring-primary/40 bg-background/80 scale-105 animate-[float_1.2s_ease-in-out_infinite,shake_0.2s_linear_infinite] z-20";

    function renderCard(card: CardConfig, section: "pinned" | "other") {
        return (
            <div
                key={card.key}
                draggable={editMode}
                tabIndex={editMode ? 0 : -1}
                onDragStart={() => editMode && handleDragStart(card.key)}
                onDragEnter={() => editMode && handleDragEnter(card.key)}
                onDragOver={e => {
                    if (!editMode) return;
                    e.preventDefault();
                    setDragOver(card.key);
                }}
                onDrop={() => editMode && handleDrop(card.key, section)}
                onDragEnd={handleDragEnd}
                className={cn(
                    "transition-shadow duration-300",
                    editMode && editCardClass,
                    dragged === card.key && "opacity-60 z-30",
                    dragOver === card.key && editMode && "ring-4 ring-primary/70 scale-110 shadow-2xl",
                    "relative"
                )}
                style={{
                    cursor: editMode ? "grab" : "default",
                    transition: "box-shadow 0.2s, transform 0.2s",
                }}
            >
                <Card className={cn(CARD_HEIGHT, CARD_WIDTH, "flex flex-col justify-between")}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            {editMode && (
                                <GripVertical className="h-4 w-4 text-primary animate-pulse mr-1" />
                            )}
                            {card.icon}
                            {card.title}
                        </CardTitle>
                        {card.badge}
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center h-full">
                        <CardBody value={card.value} subtitle={card.subtitle} />
                    </CardContent>
                </Card>
                {editMode && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 z-40 cursor-pointer"
                        title={section === "pinned" ? "Move to lower section" : "Move to featured"}
                        onClick={() =>
                            section === "pinned"
                                ? moveCard(card.key, "pinned", "other")
                                : moveCard(card.key, "other", "pinned")
                        }
                        tabIndex={-1}
                    >
                        {section === "pinned" ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </Button>
                )}
                {editMode && dragged === card.key && (
                    <div className="absolute inset-0 bg-primary/10 rounded-lg pointer-events-none z-40" />
                )}
            </div>
        );
    }

    return (
        <section aria-label="Quick niche overview" className="w-full">
            {/* Featured section (pinned) */}
            <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Featured</span>
                    <div className="flex-1 border-t border-dashed border-muted" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pinned.map(key => renderCard(cardsConfig.find(c => c.key === key)!, "pinned"))}
                </div>
            </div>
            {/* Visual separator */}
            <div className="flex items-center gap-2 my-4">
                <div className="flex-1 border-t border-muted" />
                <span className="text-xs text-muted-foreground">Other analytics</span>
                <div className="flex-1 border-t border-muted" />
            </div>
            {/* Collapsible section */}
            <div
                className={cn(
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all",
                    expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                )}
                aria-hidden={!expanded}
            >
                {order.map(key => renderCard(cardsConfig.find(c => c.key === key)!, "other"))}
            </div>
            <div className={`flex justify-center gap-2 ${editMode ? "mt-4" : "mt-2"}`}>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 cursor-pointer"
                    aria-expanded={expanded}
                    aria-controls="niche-analytics-extra"
                    onClick={() => setExpanded(prev => !prev)}
                >
                    {expanded ? "Hide analytics" : "Show all analytics"}
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                {/* <Button
                    variant={editMode ? "secondary" : "outline"}
                    size="sm"
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setEditMode(e => !e)}
                    aria-pressed={editMode}
                >
                    {editMode ? "Exit edit mode" : "Edit cards"}
                </Button> */}
            </div>
        </section>
    );
}

export default OverviewSection;