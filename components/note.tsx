"use client";
import { ArrowUpRight, InfoIcon, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Note({
    note,
    to,
    toMessage,
}: {
    note?: string;
    to?: string;
    toMessage?: string;
}) {
    const [open, setOpen] = useState(true);
    const [hide, setHide] = useState(false);
    const [closing, setClosing] = useState(false);

    if (hide && !open) return null;

    return (
        <div
            className={
                "bg-muted/50 px-5 py-3 border rounded-md flex gap-4 items-center justify-between " +
                "transition-all duration-300 ease-in-out " +
                (hide
                    ? "opacity-0 translate-y-2 pointer-events-none h-0 m-0 p-0"
                    : "opacity-100 translate-y-0 animate-in fade-in")
            }
            style={{
                maxHeight: hide ? 0 : 80,
                marginBottom: hide ? 0 : 16,
                paddingTop: hide ? 0 : undefined,
                paddingBottom: hide ? 0 : undefined,
                overflow: "hidden",
            }}
            aria-live="polite"
        >
            <div className="items-start relative flex gap-4 ">
                <InfoIcon size={16} className="mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-1 flex-1">
                    <small className="text-sm text-secondary-foreground">
                        <strong>Note:</strong> {note}
                    </small>
                    {to && (
                        <div>
                            <Link
                                href={to}
                                className="text-primary/50 hover:text-primary flex items-center text-sm gap-1"
                            >
                                {toMessage} <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Button
                size="sm"
                variant="ghost"
                disabled={closing}
                className={
                    "ml-2 px-3 py-1 text-xs rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition flex items-center justify-center " +
                    (closing ? "animate-pulse border border-green-500" : "")
                }
                onClick={() => {
                    setClosing(true);
                    setTimeout(() => {
                        setHide(true);
                        setTimeout(() => setOpen(false), 400);
                    }, 400);
                }}
                aria-label="Understand and close"
            >
                {closing ? (
                    <Check className="w-4 h-4 animate-in fade-in" />
                ) : (
                    "Understand"
                )}
            </Button>
        </div>
    );
}