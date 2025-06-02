import { UserForm } from "@/components/dashboard/settings/user-form";
import { getUser } from "@/services/auth.server";
import { getSettings } from "@/services/settings.server";
import { Suspense } from "react";

export default async function ProtectedPage() {
    const user = getUser();
    const settings = getSettings();

    return (
        <section className="space-y-6">
            <Suspense fallback={<div className="text-center">Refreshing...</div>}>
                <UserForm settings={settings} user={user} />
            </Suspense>
        </section>
    );
}