import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Providers from "@/app/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "DevShield",
    template: "%s | DevShield",
  },
  description: "Audit before you install. Check before you trust.",
  openGraph: {
    title: "DevShield",
    description: "Unified npm risk analyzer and credential leak monitor.",
    url: "/",
    siteName: "DevShield",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevShield",
    description: "Audit before you install. Check before you trust.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} min-h-screen bg-primaryBg font-body text-textPrimary antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
