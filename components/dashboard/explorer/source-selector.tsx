'use client';

import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

interface Props {
    selected: "amazon" | "alibaba";
    setSelected: (source: "amazon" | "alibaba") => void;
}

export default function SourceSelector({ selected, setSelected }: Props) {
    return (
        <div className="flex flex-wrap gap-2 mb-2 mx-auto">
            <Button
                variant={selected === "amazon" ? "default" : "outline"}
                className={cn(
                    "rounded-full font-semibold transition pl-1.5",
                    selected === "amazon" && "shadow"
                )}
                onClick={() => setSelected("amazon")}
            >
                <img src="/assets/amazon-icon.png" alt="Amazon logo" className="h-7" />
                Amazon
            </Button>
            <Button
                variant={selected === "alibaba" ? "default" : "outline"}
                className={cn(
                    "rounded-full px-4 py-1 font-semibold transition pl-1.5",
                    selected === "alibaba" && "shadow"
                )}
                onClick={() => setSelected("alibaba")}
            >
                <img src="/assets/alibaba-icon.png" alt="Alibaba logo" className="h-7" />
                Alibaba
            </Button>
        </div>
    );
}