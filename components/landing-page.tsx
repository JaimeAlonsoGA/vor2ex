import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Bell } from "lucide-react";
import Image from "next/image";

export default async function LandingPage() {
    return (
        <>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
                <div className="flex h-16 items-center justify-between px-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">V2</span>
                            </div>
                            <span className="font-bold text-xl">Vor2ex</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeSwitcher />
                        <div className="flex gap-2">
                            <Button asChild size="sm" variant="outline">
                                <Link href="/sign-in">Sign in</Link>
                            </Button>
                            <Button asChild size="sm" variant="default">
                                <Link href="/sign-up">Sign up</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex flex-col items-center justify-center min-h-screen pt-24 bg-gradient-to-b from-background to-gray-100 dark:to-background">
                <section className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl px-4">
                    <div className="relative flex flex-col items-center">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                            <span className="text-white font-bold text-3xl">V2</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-center tracking-tight mb-24">
                            Discover <span className="text-blue-600 dark:text-blue-400">rentable niches</span> on
                        </h1>
                        <Image src="/assets/amazon-logo.png" alt="Amazon Logo" width={200} height={200} className="mx-auto absolute bottom-0 z-10" />
                        <div className="absolute bottom-0 bg-gradient-to-tl from-blue-600/40 to-purple-600 h-20 w-64 rounded-2xl" />
                        {/* <p className="mt-4 text-lg text-muted-foreground text-center max-w-xl">
                            Vor2ex helps you find profitable niches, analyze products in bulk, and discover opportunities on Amazon FBA and Alibaba.
                        </p> */}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild size="lg" variant="outline">
                            <Link href="/about">
                                Learn more
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="default">
                            <Link href="/sign-up">Sign up</Link>
                        </Button>
                    </div>
                </section>
            </main>
        </>
    );
}