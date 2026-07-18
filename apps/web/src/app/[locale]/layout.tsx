/**
 * AniVerse Web - Root Layout
 * 
 * The absolute root layout for the application.
 * Handles:
 * - Font loading and optimization
 * - Global Metadata & SEO (Open Graph, Twitter, JSON-LD)
 * - RTL/LTR Direction based on locale
 * - Global Providers (Theme, Query, Toasts, etc.)
 */

import type { Metadata, Viewport } from "next";
import { Cairo, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import "@/app/globals.css";
import { Providers } from "@/components/providers/providers";

// ==============================================================================
// Font Configuration
// ==============================================================================

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// ==============================================================================
// Supported Locales
// ==============================================================================

const supportedLocales = ["ar", "en", "ja", "zh", "ko", "fr", "de", "es", "it", "pt", "tr", "ru"];

// ==============================================================================
// Metadata & SEO
// ==============================================================================

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://aniverse.com"),
  title: {
    default: "AniVerse | منصة الأنمي والرسوم المتحركة",
    template: "%s | AniVerse",
  },
  description:
    "AniVerse هي منصتك المتقدمة لمشاهدة الأنمي، الرسوم المتحركة، الأفلام، والمسلسلات بجودة عالية وبدون إعلانات. استمتع بتجربة بث سلسة مع ترجمات احترافية.",
  keywords: [
    "أنمي",
    "Anime",
    "مشاهدة أنمي",
    "أنمي مترجم",
    "رسوم متحركة",
    "أفلام أنمي",
    "مسلسلات",
    "AniVerse",
    "streaming platform",
    "korean animation",
    "chinese animation",
  ],
  authors: [{ name: "AniVerse Team", url: "https://aniverse.com" }],
  creator: "AniVerse",
  publisher: "AniVerse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    alternateLocale: ["en_US", "ja_JP", "zh_CN", "ko_KR"],
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "AniVerse",
    title: "AniVerse | منصة الأنمي والرسوم المتحركة",
    description: "منصتك المتقدمة لمشاهدة الأنمي والرسوم المتحركة بجودة عالية.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AniVerse Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AniVerse | منصة الأنمي والرسوم المتحركة",
    description: "منصتك المتقدمة لمشاهدة الأنمي والرسوم المتحركة بجودة عالية.",
    images: ["/og-image.png"],
    creator: "@AniVerse",
  },
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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: amoled)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// ==============================================================================
// JSON-LD Structured Data
// ==============================================================================

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AniVerse",
  url: process.env.NEXT_PUBLIC_APP_URL,
  description: "Advanced streaming platform for Anime, Animation, Movies, and TV Series.",
  inLanguage: ["ar", "en", "ja", "zh", "ko"],
  potentialAction: {
    "@type": "SearchAction",
    target: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// ==============================================================================
// Root Layout Component
// ==============================================================================

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // Fetch messages for next-intl
  const messages = await getMessages();

  // Determine direction
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${cairo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
