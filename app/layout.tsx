import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/app/providers";
import { Analytics } from "@vercel/analytics/next";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://devshield.vercel.app"),
  title: {
    default: "DevShield | Zero-Trust npm Security & Credential Checker",
    template: "%s | DevShield Security",
  },
  description: "DevShield is an elite, zero-trust developer security toolkit. Audit npm dependencies for CVE vulnerabilities and monitor credential leaks all in one seamless CI/CD pipeline.",
  keywords: [
    "npm audit", 
    "dependency risk analyzer", 
    "credential leak scanner", 
    "zero-trust CI/CD", 
    "vulnerability scanner", 
    "DevSecOps", 
    "package security",
    "software supply chain security"
  ],
  authors: [{ name: "DevShield Team" }],
  creator: "DevShield",
  publisher: "DevShield",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "DevShield | Zero-Trust Developer Security",
    description: "Audit npm packages, track project risk, and catch credential leaks before deployment.",
    url: "/",
    siteName: "DevShield",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevShield Security",
    description: "Audit before you install. Check before you trust.",
    creator: "@devshield",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1270139027361859"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} min-h-screen flex flex-col bg-primaryBg font-body text-textPrimary antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="mx-auto flex-grow w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
