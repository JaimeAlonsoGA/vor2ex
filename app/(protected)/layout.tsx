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
        <div className="flex min-h-screen bg-background">
            <Header />
            <Sidebar />
            <main className="flex-1 pt-16 max-w-7xl mx-auto w-full">
                <div className="p-6 w-full">{children}</div>
            </main>
        </div>
    );
}