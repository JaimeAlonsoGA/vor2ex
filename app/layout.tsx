import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Vor2ex - Ecommerce Intelligence Platform",
  description: "Advanced analytics and insights for Amazon FBA sellers",
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <main className="flex-1">
            {children}
            <Toaster richColors position="bottom-right" />
          </main>
        </div>
      </body>
    </html>
  );
}