"use client";

import { useState, useCallback } from "react";
import { Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Strategy } from "@/types";

type Notification = {
    id: string;
    keyword: string;
    strategy: Strategy;
    created_at: string;
};

interface NotificationsDropdownProps {
    activeStrategies?: Strategy;
}

export function NotificationsDropdown({ activeStrategies }: NotificationsDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useTableListener({
        table: "niches",
        onInsert: (newNiche) => {
            const nicheData = dbToNiche(newNiche);
            let bestScore = -Infinity;
            let bestStrategy = activeStrategies[0];
            for (const strategy of activeStrategies) {
                const { ratingScore, priceScore, salesScore, reviewsScore } = getProfitScoreWithStrategy(nicheData, strategy);
                const score =
                    (strategy.salesWeight ?? 0.4) * salesScore +
                    (strategy.ratingWeight ?? 0.2) * ratingScore +
                    (strategy.priceWeight ?? 0.2) * priceScore +
                    (strategy.reviewsWeight ?? 0.2) * reviewsScore;
                if (score > bestScore) {
                    bestScore = score;
                    bestStrategy = strategy;
                }
            }

            if (bestScore >= 0.7) {
                setNotifications(prev => [
                    ...prev,
                    {
                        id: nicheData.id ?? `${nicheData.keyword}-${bestStrategy.id}`,
                        keyword: nicheData.keyword,
                        strategy: bestStrategy,
                        created_at: new Date().toISOString(),
                    },
                ]);
            }
        },
    });

    const handleClear = useCallback(() => setNotifications([]), []);

    const handleGo = useCallback(() => {
        router.push("/radar");
        setNotifications([]);
    }, [router]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full text-xs border-2 border-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {notifications.length > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={handleClear}
                            aria-label="Clear notifications"
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <DropdownMenuItem disabled className="text-muted-foreground">
                        No new notifications
                    </DropdownMenuItem>
                ) : (
                    notifications.map((notif) => (
                        <DropdownMenuItem
                            key={notif.id}
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={handleGo}
                        >
                            <span className="flex items-center justify-center h-8 w-8 rounded-full border bg-muted">
                                {getIconComponent(notif.strategy.icon, "w-5 h-5 text-primary")}
                            </span>
                            <div className="flex flex-col">
                                <span className="font-medium">{notif.keyword}</span>
                                <span className="text-xs text-muted-foreground">New opportunity found!</span>
                            </div>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}