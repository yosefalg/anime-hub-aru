/**
 * AniVerse Web - Media Card Component
 * 
 * A premium, responsive card component for displaying media items (Anime, Movies, Series).
 * Features:
 * - Hover effects with smooth animations.
 * - Quality badges (HD, 4K, CAM, etc.).
 * - Rating display with star icon.
 * - Progress bar for continue watching.
 * - Full RTL/LTR support.
 * - Glassmorphism design.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Play, Clock, TrendingUp } from 'lucide-react';
import { cn, formatCompactNumber } from '@/lib/utils';

// ==============================================================================
// Types & Interfaces
// ==============================================================================

export interface MediaCardData {
  id: string;
  title: string;
  titleArabic?: string;
  slug: string;
  type: 'ANIME' | 'MOVIE' | 'TV_SERIES' | 'OVA' | 'ONA';
  coverImage: string;
  rating?: number;
  year?: number;
  episodes?: number;
  currentEpisode?: number; // For continue watching
  quality?: 'HD' | 'FHD' | '4K' | 'CAM' | 'TS';
  isTrending?: boolean;
  isNew?: boolean;
  href: string;
}

interface MediaCardProps {
  media: MediaCardData;
  variant?: 'default' | 'large' | 'compact' | 'continue';
  index?: number; // For staggered animations
}

// ==============================================================================
// Quality Badge Colors
// ==============================================================================

const QUALITY_COLORS: Record<string, string> = {
  '4K': 'bg-purple-500/90 text-white',
  'FHD': 'bg-blue-500/90 text-white',
  'HD': 'bg-green-500/90 text-white',
  'CAM': 'bg-yellow-500/90 text-black',
  'TS': 'bg-orange-500/90 text-white',
};

// ==============================================================================
// Media Card Component
// ==============================================================================

export default function MediaCard({ 
  media, 
  variant = 'default',
  index = 0 
}: MediaCardProps) {
  const isArabic = typeof window !== 'undefined' && document.documentElement.lang === 'ar';
  const title = isArabic && media.titleArabic ? media.titleArabic : media.title;

  // Determine if this is a continue watching card
  const isContinueWatching = variant === 'continue' && media.currentEpisode !== undefined;
  const progress = isContinueWatching && media.episodes 
    ? (media.currentEpisode / media.episodes) * 100 
    : 0;

  // Card size variants
  const cardSizes = {
    default: 'w-full aspect-[2/3]',
    large: 'w-full aspect-[2/3] md:aspect-[16/9]',
    compact: 'w-full aspect-[2/3]',
    continue: 'w-full aspect-video',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <Link href={media.href} className="block">
        {/* ==========================================================================
            1. Card Container with Hover Effects
            ========================================================================== */}
        <div className={cn(
          'relative overflow-hidden rounded-xl bg-muted/50 border border-border/50 transition-all duration-300',
          'group-hover:border-primary/50 group-hover:shadow-glow group-hover:scale-[1.02]',
          cardSizes[variant]
        )}>
          {/* Cover Image */}
          <div className="absolute inset-0">
            <Image
              src={media.coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 4} // Lazy load after first 4
            />
            
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
          </div>

          {/* ==========================================================================
              2. Badges (Quality, Trending, New)
              ========================================================================== */}
          <div className="absolute top-2 left-2 right-2 flex items-start justify-between z-10">
            {/* Quality Badge */}
            {media.quality && (
              <span className={cn(
                'px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm',
                QUALITY_COLORS[media.quality] || 'bg-gray-500/90 text-white'
              )}>
                {media.quality}
              </span>
            )}

            {/* Trending/New Badge */}
            <div className="flex gap-1">
              {media.isTrending && (
                <span className="px-2 py-1 rounded-md bg-red-500/90 text-white text-[10px] font-bold uppercase backdrop-blur-sm flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  HOT
                </span>
              )}
              {media.isNew && (
                <span className="px-2 py-1 rounded-md bg-primary/90 text-white text-[10px] font-bold uppercase backdrop-blur-sm">
                  NEW
                </span>
              )}
            </div>
          </div>

          {/* ==========================================================================
              3. Play Button Overlay (Shows on Hover)
              ========================================================================== */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center shadow-glow-lg"
            >
              <Play className="w-6 h-6 text-white fill-white" />
            </motion.div>
          </div>

          {/* ==========================================================================
              4. Bottom Content (Title, Rating, Episodes)
              ========================================================================== */}
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            {/* Title */}
            <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1.5 drop-shadow-md">
              {title}
            </h3>

            {/* Metadata Row */}
            <div className="flex items-center gap-2 text-xs text-white/80">
              {/* Rating */}
              {media.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{media.rating.toFixed(1)}</span>
                </div>
              )}

              {/* Year */}
              {media.year && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {media.year}
                </span>
              )}

              {/* Episodes (for Anime/Series) */}
              {(media.type === 'ANIME' || media.type === 'TV_SERIES') && media.episodes && (
                <span className="ms-auto font-medium">
                  {isContinueWatching 
                    ? `EP ${media.currentEpisode}/${media.episodes}`
                    : `${media.episodes} EP`
                  }
                </span>
              )}
            </div>
          </div>

          {/* ==========================================================================
              5. Progress Bar (Continue Watching Only)
              ========================================================================== */}
          {isContinueWatching && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-primary"
              />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
