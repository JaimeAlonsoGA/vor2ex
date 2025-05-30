"use client";

import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { Button } from "../../ui/button";
import { Settings, DraftingCompass, CreditCard } from "lucide-react";
import { UserForm } from "./user-form";
import Link from "next/link";

interface SettingsDashboardProps {
    settings: Tables<'settings'>;
    user: User;
}

export function SettingsDashboard({ settings, user }: SettingsDashboardProps) {

    return (
        <section className="space-y-6">
            <UserForm settings={settings} user={user} />
        </section>
    );
}