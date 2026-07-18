/**
 * AniVerse Web - Internationalization (i18n) Configuration
 * 
 * This file configures next-intl for:
 * - Multi-language support (Arabic, English, Japanese, etc.)
 * - RTL/LTR direction handling
 * - Locale detection and routing
 */

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// ==============================================================================
// Supported Locales
// ==============================================================================

export const locales = [
  'ar',   // Arabic (Primary)
  'en',   // English
  'ja',   // Japanese
  'zh',   // Chinese
  'ko',   // Korean
  'fr',   // French
  'de',   // German
  'es',   // Spanish
  'it',   // Italian
  'pt',   // Portuguese
  'tr',   // Turkish
  'ru',   // Russian
] as const;

export type Locale = (typeof locales)[number];

// ==============================================================================
// Locale Metadata (for routing and UI)
// ==============================================================================

export const localeMetadata: Record<Locale, { name: string; dir: 'rtl' | 'ltr'; flag: string }> = {
  ar: { name: 'العربية', dir: 'rtl', flag: '🇦' },
  en: { name: 'English', dir: 'ltr', flag: '🇺🇸' },
  ja: { name: '日本語', dir: 'ltr', flag: '🇯' },
  zh: { name: '中文', dir: 'ltr', flag: '🇳' },
  ko: { name: '한국어', dir: 'ltr', flag: '🇰🇷' },
  fr: { name: 'Français', dir: 'ltr', flag: '🇫🇷' },
  de: { name: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
  es: { name: 'Español', dir: 'ltr', flag: '🇪🇸' },
  it: { name: 'Italiano', dir: 'ltr', flag: '🇮🇹' },
  pt: { name: 'Português', dir: 'ltr', flag: '🇵🇹' },
  tr: { name: 'Türkçe', dir: 'ltr', flag: '🇹' },
  ru: { name: 'Русский', dir: 'ltr', flag: '🇺' },
};

// ==============================================================================
// Default Locale
// ==============================================================================

export const defaultLocale: Locale = 'ar';

// ==============================================================================
// Request Configuration (Server-Side)
// ==============================================================================

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Load the messages for the locale
  const messages = (await import(`./messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: 'Asia/Riyadh', // Default timezone for Arabic users
  };
});
