/**
 * AniVerse Web - Main Navigation Bar
 * 
 * A premium, responsive, and accessible navigation bar featuring:
 * - Glassmorphism design with sticky positioning.
 * - Multi-language support with automatic RTL/LTR adjustments.
 * - Theme toggling (Light, Dark, AMOLED).
 * - Instant search trigger.
 * - Mobile-responsive drawer menu.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, Moon, Sun, Monitor, Globe, 
  User, LogIn, ChevronDown, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/providers';
import { locales, localeMetadata } from '@/i18n';

// ==============================================================================
// Types & Interfaces
// ==============================================================================

interface NavLink {
  href: string;
  labelKey: string;
  icon?: React.ReactNode;
}

// ==============================================================================
// Navigation Links Configuration
// ==============================================================================

const NAV_LINKS: NavLink[] = [
  { href: '/', labelKey: 'home' },
  { href: '/anime', labelKey: 'anime' },
  { href: '/movies', labelKey: 'movies' },
  { href: '/series', labelKey: 'series' },
  { href: '/korean', labelKey: 'korean' },
  { href: '/chinese', labelKey: 'chinese' },
];

// ==============================================================================
// Navbar Component
// ==============================================================================

export default function Navbar() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, toggleTheme } = useTheme();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Handle scroll effect for glassmorphism background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsLangDropdownOpen(false);
      setIsUserDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // ============================================================================
  // Render Helpers
  // ============================================================================

  const renderThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5" />;
    if (theme === 'dark') return <Moon className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-xl border-border shadow-sm' 
          : 'bg-transparent border-transparent'
      )}
      dir={localeMetadata[locale as keyof typeof localeMetadata]?.dir || 'ltr'}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* ==========================================================================
              1. Logo & Desktop Navigation
              ========================================================================== */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight hidden sm:block">
                Ani<span className="text-primary">Verse</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <ul className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ==========================================================================
              2. Search Bar (Desktop)
              ========================================================================== */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder={tCommon('search')}
                className="w-full bg-muted/50 border border-transparent focus:border-primary/50 rounded-full py-2 ps-10 pe-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <kbd className="absolute end-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs"></span>K
              </kbd>
            </div>
          </div>

          {/* ==========================================================================
              3. Actions (Theme, Language, User)
              ========================================================================== */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Trigger (Mobile) */}
            <button className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle Theme"
            >
              {renderThemeIcon()}
            </button>

            {/* Language Selector */}
            <div className="relative hidden sm:block" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium uppercase">{locale}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isLangDropdownOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute end-0 mt-2 w-48 rounded-xl border border-border bg-popover p-1 shadow-lg z-50"
                  >
                    {locales.map((lang) => (
                      <Link
                        key={lang}
                        href={pathname}
                        locale={lang}
                        onClick={() => setIsLangDropdownOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                          locale === lang ? 'bg-primary/10 text-primary' : 'text-popover-foreground hover:bg-muted'
                        )}
                      >
                        <span>{localeMetadata[lang].name}</span>
                        <span className="text-xs text-muted-foreground">{localeMetadata[lang].flag}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu (Mockup for unauthenticated state) */}
            <div className="relative hidden sm:block" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1 pe-3 rounded-full border border-border hover:bg-muted transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isUserDropdownOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute end-0 mt-2 w-56 rounded-xl border border-border bg-popover p-1 shadow-lg z-50"
                  >
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-sm font-medium text-foreground">Guest User</p>
                      <p className="text-xs text-muted-foreground truncate">guest@aniverse.com</p>
                    </div>
                    <Link href="/login" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted">
                      <LogIn className="w-4 h-4" /> {t('login')}
                    </Link>
                    <Link href="/register" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted">
                      <User className="w-4 h-4" /> {t('register')}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          4. Mobile Menu Drawer
          ========================================================================== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={tCommon('search')}
                  className="w-full bg-muted border border-border rounded-lg py-2.5 ps-10 pe-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Mobile Links */}
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'block px-3 py-2.5 rounded-lg text-base font-medium transition-colors',
                          isActive ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
                        )}
                      >
                        {t(link.labelKey)}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-border space-y-2">
                <Link href="/login" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                  <LogIn className="w-4 h-4" /> {t('login')}
                </Link>
                <Link href="/register" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors">
                  <User className="w-4 h-4" /> {t('register')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
