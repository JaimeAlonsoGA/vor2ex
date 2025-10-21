import { VerifyEmailPage } from "@/pages/auth/verify-email";
import { RedirectProvider } from "@/providers/redirect-provider";
import { Route, Routes } from "react-router-dom";
import AuthPage from "@/pages/auth/authentication";

export const UnauthenticatedApp = () => {
    return (
        <RedirectProvider>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/" element={<AuthPage />} />
                <Route path="*" element={<AuthPage />} />
            </Routes>
        </RedirectProvider>
    );
}