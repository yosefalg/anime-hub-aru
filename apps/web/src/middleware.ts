/**
 * AniVerse Web - Middleware Configuration
 * 
 * Handles:
 * - Internationalization (i18n) routing and locale detection
 * - Automatic redirection based on browser language
 * - Locale persistence via cookies
 * - Route protection and static file exclusion
 */

import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '../i18n';

// ==============================================================================
// Middleware Configuration
// ==============================================================================

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: locales as unknown as string[],
  
  // Used when no locale matches
  defaultLocale: defaultLocale,
  
  // 'as-needed': Only prefixes the URL if the locale is not the default.
  // 'always': Always prefixes the URL.
  // 'never': Never prefixes the URL.
  localePrefix: 'as-needed',
});

// ==============================================================================
// Export Middleware
// ==============================================================================

export default intlMiddleware;

// ==============================================================================
// Matcher Configuration
// ==============================================================================

export const config = {
  // Match all pathnames except for:
  // - Next.js internals (/_next)
  // - Vercel internals (/_vercel)
  // - Static files (e.g., /favicon.ico, /robots.txt, /images/*)
  // - API routes (/api/*)
  matcher: [
    '/', 
    '/(ar|en|ja|zh|ko|fr|de|es|it|pt|tr|ru)/:path*', 
    '/((?!_next|_vercel|api|.*\\..*).*)'
  ],
};
