import { SettingsDashboard } from "@/components/dashboard/settings/dashboard";
import { getUser } from "@/services/auth.server";
import { getSettings } from "@/services/settings.server";
import { Suspense } from "react";


export default async function ProtectedPage() {
    const user = await getUser();
    const settings = await getSettings();

    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <SettingsDashboard settings={settings} user={user} />
        </Suspense>
    );
}