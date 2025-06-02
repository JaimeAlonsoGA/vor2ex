"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GoBack({ routeName }: { routeName?: string } = {}) {
    const router = useRouter();
    return (
        <Button variant="outline" onClick={() => router.back()} className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            {routeName && <span className="text-sm text-muted-foreground">{routeName}</span>}
        </Button>
    )
}