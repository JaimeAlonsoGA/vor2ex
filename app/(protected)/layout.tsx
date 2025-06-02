import Header from "@/components/dashboard/ui/header";
import Sidebar from "@/components/dashboard/ui/sidebar";
import { getUser } from "@/services/auth.server";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getUser();
    if (!user) redirect("/");

    return (
        <div className="flex min-h-screen bg-background" >
            <Header user={user} />
            <Sidebar />
            <main className="flex-1 pt-16 md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto w-full">
                <div className="p-6 w-full">{children}</div>
            </main>
        </div>
    );
}