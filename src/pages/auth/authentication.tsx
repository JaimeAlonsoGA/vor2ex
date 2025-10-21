import { useState } from "react";
import AuthImage from "./components/auth-image"
import { LoginForm } from "./components/login-form"
import SignUpForm from "./components/signup-form";
import { PageContent } from "@/components/layout/content";

export default function AuthPage() {
    const [loggingIn, setLoggingIn] = useState(true);
    return (
        <PageContent className="flex flex-row bg-foreground xl:bg-background">
            <div className="w-full md:w-2/5 flex items-center justify-center ">
                <div className="max-w-md w-full">
                    {loggingIn ? <LoginForm setLoggingIn={setLoggingIn} /> : <SignUpForm setLoggingIn={setLoggingIn} />}
                </div>
            </div>
            <div className="hidden w-3/5 md:flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-purple-200">
                <AuthImage />
            </div>
        </PageContent>
    )
}