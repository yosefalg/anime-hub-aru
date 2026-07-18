/**
 * AniVerse Web - Hero Banner
 * 
 * A premium, animated hero section for the homepage featuring:
 * - Auto-rotating carousel of featured media.
 * - Glassmorphism content container.
 * - Fluid animations using Framer Motion.
 * - Full RTL/LTR support and responsive design.
 * - Action buttons (Watch Now, Trailer, Add to List).
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Info, Plus, Star, Calendar, Clock, 
  ChevronLeft, ChevronRight, Volume2, VolumeX 
} from 'lucide-react';
import { cn, formatTime, formatCompactNumber } from '@/lib/utils';

// ==============================================================================
// Types & Interfaces
// ==============================================================================

export interface HeroMediaItem {
  id: string;
  title: string;
  titleArabic?: string;
  description: string;
  descriptionArabic?: string;
  coverImage: string;
  logoImage?: string; // Optional transparent logo
  rating: number;
  year: number;
  duration: string; // e.g., "24m" or "2h 15m"
  genres: string[];
  videoUrl?: string; // Optional trailer video URL
  href: string;
}

interface HeroBannerProps {
  items: HeroMediaItem[];
  autoPlayInterval?: number;
}

// ==============================================================================
// Mock Data (Replace with API data later)
// ==============================================================================

const MOCK_HERO_ITEMS: HeroMediaItem[] = [
  {
    id: '1',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    titleArabic: 'قاتل الشياطين: كيميتسو نو يايبا',
    description: 'Tanjiro Kamado, joined with Inosuke Hashibira and Zenitsu Agatsuma, boards the Infinity Train on a new mission to investigate the disappearance of over forty people in a very short period of time.',
    descriptionArabic: 'ينضم تانجيرو كامادو، مع إنوسكي هاشيبيرا وزينيتسو أغاتسوما، إلى قطار اللانهاية في مهمة جديدة للتحقيق في اختفاء أكثر من أربعين شخصاً في فترة زمنية قصيرة جداً.',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2560&auto=format&fit=crop', // Placeholder
    rating: 8.7,
    year: 2023,
    duration: '24m',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    href: '/anime/demon-slayer',
  },
  {
    id: '2',
    title: 'Attack on Titan: The Final Season',
    titleArabic: 'هجوم العمالقة: الموسم الأخير',
    description: 'Humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid beings who devour humans seemingly without reason.',
    descriptionArabic: 'تعيش البشرية داخل مدن محاطة بجدران ضخمة بسبب العمالقة، كائنات عملاقة شبيهة بالبشر تلتهم البشر دون سبب واضح.',
    coverImage: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=2560&auto=format&fit=crop', // Placeholder
    rating: 9.1,
    year: 2023,
    duration: '24m',
    genres: ['Action', 'Drama', 'Fantasy'],
    href: '/anime/attack-on-titan',
  },
];

// ==============================================================================
// Hero Banner Component
// ==============================================================================

export default function HeroBanner({ 
  items = MOCK_HERO_ITEMS, 
  autoPlayInterval = 6000 
}: HeroBannerProps) {
  const t = useTranslations('home.hero');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play logic
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, autoPlayInterval, isPaused]);

  const currentItem = items[currentIndex];

  // Determine text based on locale (simplified for demo, use next-intl properly in prod)
  const isArabic = typeof window !== 'undefined' && document.documentElement.lang === 'ar';
  const title = isArabic && currentItem.titleArabic ? currentItem.titleArabic : currentItem.title;
  const description = isArabic && currentItem.descriptionArabic ? currentItem.descriptionArabic : currentItem.description;

  return (
    <section 
      className="relative h-[85vh] min-h-[600px] w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ==========================================================================
          1. Background Images with AnimatePresence
          ========================================================================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentItem.coverImage})` }}
          />
          
          {/* Gradient Overlays for readability and premium feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-transparent h-32" />
        </motion.div>
      </AnimatePresence>

      {/* ==========================================================================
          2. Content Container
          ========================================================================== */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-20 md:pb-32">
        <div className="max-w-3xl space-y-6">
          
          {/* Animated Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight drop-shadow-lg">
                {title}
              </h1>

              {/* Metadata (Rating, Year, Duration, Genres) */}
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-muted-foreground">
                <div className="flex items-center gap-1.5 text-yellow-500 font-semibold">
                  <Star className="w-5 h-5 fill-yellow-500" />
                  <span>{currentItem.rating}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{currentItem.year}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{currentItem.duration}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  {currentItem.genres.map((genre, idx) => (
                    <React.Fragment key={genre}>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-foreground">
                        {genre}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-muted-foreground line-clamp-3 max-w-2xl leading-relaxed">
                {description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={currentItem.href}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-glow hover:shadow-glow-lg active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" />
                  {t('watchNow')}
                </Link>
                
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-foreground font-semibold hover:bg-white/20 transition-all active:scale-95">
                  <Plus className="w-5 h-5" />
                  {t('addToWatchlist')}
                </button>

                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-foreground font-semibold hover:bg-white/20 transition-all active:scale-95">
                  <Info className="w-5 h-5" />
                  {t('moreInfo')}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ==========================================================================
          3. Navigation Controls & Pagination
          ========================================================================== */}
      
      {/* Side Arrows (Desktop) */}
      <div className="absolute inset-y-0 left-0 right-0 z-20 hidden md:flex items-center justify-between px-4 pointer-events-none">
        <button 
          onClick={prevSlide}
          className="pointer-events-auto p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="pointer-events-auto p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              idx === currentIndex ? 'w-8 bg-primary' : 'w-4 bg-white/30 hover:bg-white/60'
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Mute Toggle (Bottom Right) */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-8 right-8 z-20 p-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hidden md:block"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </section>
  );
}
