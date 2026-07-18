/**
 * AniVerse Web - Main Footer
 * 
 * A premium, responsive footer featuring:
 * - Multi-column layout with navigation, legal, and social links.
 * - Full RTL/LTR support using logical Tailwind properties.
 * - Glassmorphism and dark mode compatibility.
 * - Dynamic copyright year and localized text.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  Play, Github, Twitter, Discord, Mail, Heart, 
  Globe, Shield, FileText, HelpCircle, Briefcase 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { localeMetadata } from '@/i18n';

// ==============================================================================
// Footer Links Configuration
// ==============================================================================

interface FooterLink {
  labelKey: string;
  href: string;
  icon?: React.ReactNode;
}

const NAVIGATION_LINKS: FooterLink[] = [
  { labelKey: 'home', href: '/' },
  { labelKey: 'anime', href: '/anime' },
  { labelKey: 'movies', href: '/movies' },
  { labelKey: 'series', href: '/series' },
  { labelKey: 'news', href: '/news' },
];

const LEGAL_LINKS: FooterLink[] = [
  { labelKey: 'terms', href: '/terms', icon: <FileText className="w-4 h-4" /> },
  { labelKey: 'privacy', href: '/privacy', icon: <Shield className="w-4 h-4" /> },
  { labelKey: 'dmca', href: '/dmca', icon: <Shield className="w-4 h-4" /> },
  { labelKey: 'faq', href: '/faq', icon: <HelpCircle className="w-4 h-4" /> },
];

const COMPANY_LINKS: FooterLink[] = [
  { labelKey: 'about', href: '/about', icon: <Briefcase className="w-4 h-4" /> },
  { labelKey: 'contact', href: '/contact', icon: <Mail className="w-4 h-4" /> },
  { labelKey: 'careers', href: '/careers', icon: <Briefcase className="w-4 h-4" /> },
  { labelKey: 'blog', href: '/blog', icon: <FileText className="w-4 h-4" /> },
];

const SOCIAL_LINKS = [
  { name: 'Twitter', href: 'https://twitter.com/aniverse', icon: <Twitter className="w-5 h-5" /> },
  { name: 'Discord', href: 'https://discord.gg/aniverse', icon: <Discord className="w-5 h-5" /> },
  { name: 'GitHub', href: 'https://github.com/aniverse', icon: <Github className="w-5 h-5" /> },
];

// ==============================================================================
// Footer Component
// ==============================================================================

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
  const dir = localeMetadata[locale as keyof typeof localeMetadata]?.dir || 'ltr';

  return (
    <footer 
      className="relative border-t border-border bg-background/50 backdrop-blur-sm mt-auto"
      dir={dir}
    >
      {/* Gradient overlay for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* ==========================================================================
              1. Brand Column
              ========================================================================== */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                Ani<span className="text-primary">Verse</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {t('madeWith')}
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* ==========================================================================
              2. Navigation Column
              ========================================================================== */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {t('nav') || 'Navigation'}
            </h3>
            <ul className="space-y-2.5">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors" />
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ==========================================================================
              3. Company Column
              ========================================================================== */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {t('contact') || 'Company'}
            </h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">
                      {link.icon}
                    </span>
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ==========================================================================
              4. Legal Column
              ========================================================================== */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {t('terms') || 'Legal'}
            </h3>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">
                      {link.icon}
                    </span>
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ==========================================================================
            5. Bottom Bar (Copyright & Locale)
            ========================================================================== */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-start">
            {t('copyright', { year: currentYear })}
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase font-medium">{locale}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              v1.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
