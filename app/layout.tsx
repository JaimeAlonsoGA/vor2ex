import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Vor2ex",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <nav className="w-full border-b border-b-foreground/10 h-16 flex justify-center">
            <div className={cn("w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm")}>
              <div className="flex gap-5 items-center font-semibold">
                <Link href="/">Vor2ex</Link>
              </div>
              <HeaderAuth />
            </div>
          </nav>
          <main className="flex-1 w-full flex flex-col items-center">
            <section className={cn("w-full max-w-7xl p-5 flex flex-col gap-12")}>
              {children}
            </section>
          </main>
          <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-8">
            <p>
              All rights reserved to{" "}
              <a  
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                Cloudcom LLC
              </a>
            </p>
            <ThemeSwitcher />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}