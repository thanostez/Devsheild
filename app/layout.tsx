import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/app/providers";
import { Analytics } from "@vercel/analytics/next";
import GoogleAdsense from "@/components/GoogleAdsense";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://devsheild.live"),
  title: {
    default: "DevShield | Audit npm Packages and Check Credential Breaches",
    template: "%s | DevShield Security",
  },
  description:
    "Audit npm dependencies for vulnerabilities, assess package risk, and check credential breach exposure in one developer security toolkit.",
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
    title: "DevShield | Audit npm Packages and Check Credential Breaches",
    description:
      "Scan npm dependencies for CVEs, uncover risky packages, and monitor credential leak exposure before release.",
    url: "/",
    siteName: "DevShield",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DevShield security dashboard preview",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevShield | Audit npm Packages and Check Credential Breaches",
    description:
      "Scan npm dependencies for CVEs, uncover risky packages, and monitor credential leak exposure before release.",
    images: ["/opengraph-image"],
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
        <GoogleAdsense publisherId="ca-pub-1270139027361859" />
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
