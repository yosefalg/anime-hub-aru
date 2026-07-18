/**
 * AniVerse Web - Media Slider Section
 * 
 * A reusable, horizontal scrolling section used across the homepage.
 * Features:
 * - Native smooth scrolling with custom navigation arrows.
 * - Full RTL/LTR support (arrows and scroll direction adapt automatically).
 * - Edge fade effects to indicate scrollable content.
 * - Responsive header with "View All" link.
 */

'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { localeMetadata } from '@/i18n';

// ==============================================================================
// Types & Interfaces
// ==============================================================================

interface MediaSliderProps {
  title: string;
  viewAllLink?: string;
  children: React.ReactNode;
  className?: string;
}

// ==============================================================================
// Media Slider Component
// ==============================================================================

export default function MediaSlider({ 
  title, 
  viewAllLink, 
  children, 
  className 
}: MediaSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const dir = localeMetadata[locale as keyof typeof localeMetadata]?.dir || 'ltr';
  
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // ============================================================================
  // Scroll Logic & Arrow Visibility
  // ============================================================================

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      // Check if we can scroll left
      setShowLeftArrow(scrollLeft > 10);
      
      // Check if we can scroll right (with a small buffer for rounding errors)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef.current;
      // Scroll by 80% of the container width for a smooth carousel feel
      const scrollAmount = current.clientWidth * 0.8; 
      
      // In RTL, positive scroll moves left, negative moves right. 
      // However, standardizing the math:
      const isRtl = dir === 'rtl';
      const multiplier = isRtl ? -1 : 1;
      const scrollBy = direction === 'right' ? scrollAmount * multiplier : -scrollAmount * multiplier;

      current.scrollBy({ left: scrollBy, behavior: 'smooth' });
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <section className={cn("relative py-6 md:py-10 group/slider", className)}>
      {/* ==========================================================================
          1. Section Header
          ========================================================================== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
          {title}
          <div className="h-1 w-8 rounded-full bg-primary" />
        </h2>
        
        {viewAllLink && (
          <Link 
            href={viewAllLink}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            عرض الكل
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
          </Link>
        )}
      </div>

      {/* ==========================================================================
          2. Slider Container
          ========================================================================== */}
      <div className="relative">
        {/* Left Fade Gradient */}
        {showLeftArrow && (
          <div className="absolute start-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        )}
        
        {/* Right Fade Gradient */}
        {showRightArrow && (
          <div className="absolute end-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        )}

        {/* Navigation Arrows */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute start-2 md:start-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all opacity-0 group-hover/slider:opacity-100"
            aria-label="Scroll Left"
          >
            {dir === 'rtl' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute end-2 md:end-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all opacity-0 group-hover/slider:opacity-100"
            aria-label="Scroll Right"
          >
            {dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          dir={dir}
          className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 sm:px-6 lg:px-8 pb-4 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
