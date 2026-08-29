import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { BRAND } from "@/lib/ussap/data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.fullName}`,
  description: BRAND.tagline,
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: BRAND.name,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-[#f4f7fa] text-slate-900 antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
