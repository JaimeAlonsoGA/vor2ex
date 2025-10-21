import { PageContent } from "@/components/layout/content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircleCheck, Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Icon } from "@/components/layout/branding";
import { useState } from "react";

export const VerifyEmailPage = () => {
    const { t } = useTranslation('auth');
    const [isResending, setIsResending] = useState(false);

    const handleResendEmail = async () => {
        setIsResending(true);
        setTimeout(() => {
            setIsResending(false);
        }, 2000);
    };

    return (
        <PageContent className="bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <Icon />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            {t("verify-email.title")}
                        </h1>
                        <p className="text-muted-foreground">
                            {t("verify-email.subtitle")}
                        </p>
                    </div>

                    {/* Main Card */}
                    <Card className="p-6 shadow-lg">
                        <div className="text-center space-y-6">
                            {/* Success Icon */}
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                                <CircleCheck className="w-8 h-8 text-green-600" />
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                <h2 className="text-xl font-semibold text-foreground">
                                    {t("verify-email.email-sent")}
                                </h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t("verify-email.check-inbox")}
                                </p>
                            </div>

                            {/* Steps */}
                            <div className="bg-muted/50 rounded-lg p-4 text-left">
                                <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {t("verify-email.what-to-do-next")}
                                </h3>
                                <ol className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex-shrink-0 mt-0.5">1</span>
                                        {t("verify-email.check-your-email")}
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex-shrink-0 mt-0.5">2</span>
                                        {t("verify-email.click-verify-email")}
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex-shrink-0 mt-0.5">3</span>
                                        {t("verify-email.return-to-sign-in")}
                                    </li>
                                </ol>
                            </div>

                            {/* Actions */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        onClick={handleResendEmail}
                                        disabled={isResending}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        {isResending ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                {t("verify-email.resending")}
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="w-4 h-4 mr-2" />
                                                {t("verify-email.resend-email")}
                                            </>
                                        )}
                                    </Button>
                                    <Link to="/login" className="flex-1">
                                        <Button className="w-full">
                                            {t("verify-email.continue-to-sign-in")}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            {t("verify-email.back-to-sign-in")}
                        </Link>
                    </div>

                    {/* Help text */}
                    <div className="text-center mt-8 p-4 bg-card rounded-lg border">
                        <p className="text-sm text-muted-foreground">
                            {t("verify-email.having-trouble")}
                            <button
                                onClick={handleResendEmail}
                                className="text-primary hover:underline font-medium"
                            >
                                {t("verify-email.resend-verification-email")}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </PageContent>
    );
};