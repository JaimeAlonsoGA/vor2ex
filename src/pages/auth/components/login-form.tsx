import { FormItemWrapper } from "@/components/form/item-wrapper";
import { FormWrapper } from "@/components/form/wrapper";
import { Icon } from "@/components/layout/branding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { useRedirect } from "@/providers/redirect-provider";
import { LoginFormData, loginSchema } from "@/types/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const LoginForm = ({ setLoggingIn }: { setLoggingIn: (loggingIn: boolean) => void }) => {
    const [showPassword, setShowPassword] = useState(false)
    const { signIn, isSigningIn } = useAuth()
    const { t } = useTranslation("auth")
    const redirectTo = useRedirect();
    const navigate = useNavigate()

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        } as LoginFormData,
        resolver: loginSchema ? (zodResolver(loginSchema as any) as any) : undefined,
    });

    const switchToSignUp = () => {
        setLoggingIn(false);
    }

    const handleSubmit = async (values: LoginFormData) => {
        const credentials = { email: values.email!, password: values.password }

        toast.promise(
            signIn(credentials).then((result) => {
                if (result.success) {
                    navigate(redirectTo || "/dashboard");
                }
            }),
            {
                loading: t("login.signing-in"),
                success: t("login.signed-in"),
                error: (err) => err.message || t("login.failed-to-sign-in"),
            }
        );
    }

    return (
        <section className="mx-auto w-full max-w-md space-y-6 p-6 bg-foreground rounded-xl shadow-md">
            <div className="text-center space-y-2">
                <h1 className="text-xl font-bold text-background">{t("login.title")}</h1>
                <p className="text-muted-foreground">{t("login.subtitle")}</p>
            </div>

            <div className="relative w-full mb-4">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-foreground">
                        <Icon />
                    </span>
                </div>
            </div>

            <FormWrapper
                onSubmit={handleSubmit}
                form={form}
                className="space-y-4">

                <FormItemWrapper label={t("login.email")} name="email">
                    <Input type="email" placeholder={t("login.email-placeholder")} className="text-background   " />
                </FormItemWrapper>

                <FormItemWrapper label={t("login.password")} name="password">
                    {(field) => (
                        <div className="relative">
                            <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder={t("login.password-placeholder")}
                                className="text-background"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-background hover:text-foreground"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    )}
                </FormItemWrapper>

                {/* <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            alert("Password reset functionality coming soon!")
                        }}
                        className="text-sm text-primary hover:text-primary/80"
                    >
                        {t("login.forgot-password")}
                    </button>
                </div> */}

                <Button type="submit" disabled={isSigningIn} className="!bg-background text-foreground w-full" >
                    {isSigningIn ? t("login.signing-in") : t("login.sign-in")}
                </Button>
            </FormWrapper>

            <div className="flex flex-row items-center gap-1">
                <p className="text-sm text-muted-foreground">
                    {t("login.no-account")}{" "}
                </p>
                <button
                    onClick={switchToSignUp}
                    className="text-background underline text-sm"
                >
                    {t("login.sign-up")}
                </button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
                This site is protected by reCAPTCHA and the Google{" "}
                <span className="underline cursor-pointer">
                    Privacy Policy
                </span>{" "}
                and{" "}
                <span className="underline cursor-pointer">
                    Terms of Service
                </span>{" "}
                apply.
            </p>
        </section>
    )
}