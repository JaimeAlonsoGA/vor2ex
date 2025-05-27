"use client";

import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { Button } from "../../ui/button";
import { Settings, DraftingCompass, CreditCard } from "lucide-react";
import { UserForm } from "./user-form";
import Link from "next/link";

interface SettingsDashboardProps {
    userProfile: Tables<'users'>;
    auth: User;
}

export function SettingsDashboard({ userProfile, auth }: SettingsDashboardProps) {

    return (
        <section className="space-y-6">
            <UserForm userProfile={userProfile} auth={auth} />
        </section>
    );
}