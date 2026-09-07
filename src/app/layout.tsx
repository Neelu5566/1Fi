import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { MobileNav } from "@/components/layout/MobileNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "1Fi - Mutual Fund backed EMIs",
  description:
    "Shop today, pay later using your mutual funds. Browse the 1Fi Marketplace and pick an EMI plan without redeeming your investments.",
};

export const viewport: Viewport = {
  themeColor: "#712CDC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        {/* The app is phone-first and centres itself on larger screens. */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[500px] flex-col">
          <main className="flex flex-1 flex-col gap-5 px-4 py-4 pb-[calc(5rem+env(safe-area-inset-bottom))]">
            {children}
          </main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
