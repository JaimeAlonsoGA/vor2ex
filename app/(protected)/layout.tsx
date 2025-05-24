import Header from "@/components/dashboard/ui/header";
import Sidebar from "@/components/dashboard/ui/sidebar";
import { getAuthUser } from "@/services/auth.service";
import { createUserIfNotExists } from "@/services/users.service";
import { ThemeProvider } from "next-themes";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const authenticated = await getAuthUser();
    if (!authenticated) {
        redirect("/sign-in");
    } else createUserIfNotExists();

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen bg-background">
                <Header />
                <Sidebar />
                <main className="flex-1 pt-16 max-w-7xl mx-auto w-full">
                    <div className="p-6 w-full">{children}</div>
                </main>
            </div>
        </ThemeProvider>
    );
}