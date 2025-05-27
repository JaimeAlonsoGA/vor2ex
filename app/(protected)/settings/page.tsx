import { SettingsDashboard } from "@/components/dashboard/settings/dashboard";
import { getAuthUser } from "@/services/auth.server";
import { getUserData } from "@/services/users.server";
import { Suspense } from "react";


export default async function ProtectedPage() {
    const userProfile = await getUserData();
    const authUser = await getAuthUser();

    if (!userProfile || !authUser) {
        return <div className="text-center">You must be logged in to view this page.</div>;
    }

    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <SettingsDashboard userProfile={userProfile} auth={authUser} />
        </Suspense>
    );
}