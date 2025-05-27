"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export function useTableListener({ table, onInsert }: { table: string; onInsert: (payload: any) => void }) {
    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel(`public:${table}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table },
                (payload) => {
                    onInsert(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [table, onInsert]);
}