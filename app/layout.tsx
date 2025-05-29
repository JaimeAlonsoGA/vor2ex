import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Vor2ex - Ecommerce Intelligence Platform",
  description: "Advanced analytics and insights for Amazon FBA sellers",
  icons: {
    icon: "favicon.ico",
    shortcut: "favicon.ico",
  },
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scrollbar-y-none">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <main className="flex-1">
              {children}
              <Toaster richColors position="bottom-right" />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}