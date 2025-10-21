import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/providers/auth-provider"
import { Mail, Phone, Eye, EyeOff, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SignUpFormData, signUpSchema } from "@/types/schemas/auth-schemas"
import { FormWrapper } from "@/components/form/wrapper"
import { FormItemWrapper } from "@/components/form/item-wrapper"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormSelect } from "@/components/form/form-select"
import { useRedirect } from "@/providers/redirect-provider"
import { Separator } from "@/components/ui/separator"
import { Icon } from "@/components/layout/branding"
import { toast } from "sonner"

export default function SignUpForm({ setLoggingIn }: { setLoggingIn: (loggingIn: boolean) => void }) {
    const { signUp, isSigningUp } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    const { t } = useTranslation('auth');

    // LOGIC TO RESET EMAIL/PHONE FIELDS WHEN SWITCHING AUTH METHOD
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false,
        } as SignUpFormData,
        resolver: signUpSchema ? (zodResolver(signUpSchema as any) as any) : undefined,
    });

    const switchToSignIn = () => {
        setLoggingIn(true);
    }

    const handleSubmit = async (values: SignUpFormData) => {
        const credentials = {
            email: values.email,
            password: values.password,
        }
        toast.promise(
            signUp(credentials).then((result) => {
                if (result.success)
                    return navigate("/verify-email");
            }),
            {
                loading: "Creating account...",
                success: "Account created successfully!",
                error: (err) => err.message || "Failed to create account",
            }
        );
    }

    const getPasswordStrength = (password: string) => {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[^a-zA-Z0-9]/.test(password)) strength++
        return strength
    }

    return (
        <section className="mx-auto w-full max-w-md space-y-6 p-6 bg-foreground rounded-xl shadow-md">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-background">{t('join')}</h1>
                <p className="text-muted-foreground">{t("create-account-description")}</p>
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
            <FormWrapper form={form} onSubmit={handleSubmit} className="space-y-4">
                <FormItemWrapper label={t("email-address")} name="email">
                    {(field) => (
                        <Input
                            {...field}
                            type="email"
                            placeholder={t("enter-your-email")}
                            className="text-background"
                        />
                    )}
                </FormItemWrapper>

                <FormItemWrapper label={t("password")} name="password">
                    {(field) => (
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t("create-password")}
                                    className="text-background"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {field.value && (
                                <div className="space-y-1">
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((level) => {
                                            const strength = getPasswordStrength(field.value)
                                            const strengthColors = [
                                                "bg-red-500",
                                                "bg-red-400",
                                                "bg-yellow-500",
                                                "bg-green-400",
                                                "bg-green-500",
                                            ]
                                            return (
                                                <div
                                                    key={level}
                                                    className={`h-2 w-full rounded ${strength >= level ? strengthColors[strength - 1] : "bg-muted"
                                                        }`}
                                                />
                                            )
                                        })}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {t("password-strength")}
                                        {[t('too-short'), t("very-weak"), t("weak"), t("fair"), t("good"), t("strong")][getPasswordStrength(field.value)] ||
                                            t("too-short")}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </FormItemWrapper>
                <FormItemWrapper label="Confirm Password *" name="confirmPassword">
                    {(field) => (
                        <div className="relative">
                            <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className="text-background"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    )}
                </FormItemWrapper>

                <FormItemWrapper name="acceptTerms">
                    {(field) => (
                        <div className="flex items-start space-x-2">
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} className="text-background mt-1" />
                            <span className="text-sm text-muted-foreground">
                                {t("i-accept-the")}{" "}
                                <button
                                    type="button"
                                    onClick={() => alert("Terms and Conditions coming soon!")}
                                    className="text-background hover:text-background/80 underline"
                                >
                                    {t("terms-and-conditions")}
                                </button>{" "}
                                {t("and")}{" "}
                                <button
                                    type="button"
                                    onClick={() => alert("Privacy Policy coming soon!")}
                                    className="text-background hover:text-background/80 underline"
                                >
                                    {t("privacy-policy")}
                                </button>
                            </span>
                        </div>
                    )}
                </FormItemWrapper>

                <Button type="submit" disabled={isSigningUp} className="!bg-background text-foreground w-full">
                    {isSigningUp ? "Creating account..." : "Create account"}
                </Button>
            </FormWrapper>
            <div className="flex flex-row items-center gap-1">
                <p className="text-sm text-muted-foreground">
                    {t("already-have-an-account")}{" "}
                </p>
                <button
                    onClick={switchToSignIn}
                    className="text-background underline text-sm"
                >
                    {t("login.sign-in")}
                </button>
            </div>
        </section >
    )
}