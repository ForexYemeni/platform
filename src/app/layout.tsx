import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Crypto Mining Investment Platform 2026 | منصة الاستثمار والتعدين",
  description:
    "Premium crypto mining & investment platform for 2026. Mine Bitcoin, Ethereum, USDT and more with industry-leading daily returns. Built for serious investors.",
  keywords: [
    "crypto mining",
    "investment platform",
    "Bitcoin mining",
    "Ethereum",
    "USDT",
    "crypto investment 2026",
    "تعدين العملات",
    "استثمار رقمي",
  ],
  authors: [{ name: "Crypto Mining Platform" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Crypto Mining Investment Platform 2026",
    description: "The world's most advanced crypto mining investment platform.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Mining Investment Platform 2026",
    description: "The world's most advanced crypto mining investment platform.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} ${tajawal.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
