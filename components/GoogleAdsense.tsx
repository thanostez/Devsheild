"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

interface GoogleAdsenseProps {
  publisherId: string;
}

export default function GoogleAdsense({ publisherId }: GoogleAdsenseProps) {
  const pathname = usePathname();

  // Define pages where ads should NOT be shown (e.g., utility pages, thin tools)
  // or pages used for navigation/alerts.
  const excludedPages = [
    "/privacy-policy",
    "/terms-and-conditions",
    // We can add more here if Google still complains about specific screens
  ];

  if (excludedPages.includes(pathname)) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
