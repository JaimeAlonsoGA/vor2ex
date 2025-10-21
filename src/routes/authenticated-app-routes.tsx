import { PageContent } from "@/components/layout/content";
import Header from "@/components/layout/header";
import { AppSidebar } from "@/components/layout/navigation/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardPage from "@/pages/dashboard";
import { useUserWithStrategy } from "@/queries/auth.queries";
import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

const AuthenticatedLayout = () => {
    return (
        <React.Fragment>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <Header />
                    <PageContent>
                        <Outlet />
                    </PageContent>
                </SidebarInset>
            </SidebarProvider>
        </React.Fragment>
    );
};

export const AuthenticatedApp = () => {
    const { data: userWithStrategy, isLoading, error } = useUserWithStrategy();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">Loading user data...</div>
            </div>
        );
    }

    if (error || !userWithStrategy) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <Routes>
            <Route path="/" element={<AuthenticatedLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}