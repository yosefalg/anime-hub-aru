/**
 * AniVerse Web - Homepage
 * 
 * The main landing page of the platform.
 * Assembles the Hero Banner, Media Sliders, and Category sections.
 * This is a Server Component for optimal SEO and initial load performance.
 */

import React from 'react';
import { getTranslations } from 'next-intl/server';
import { HeroBanner, HeroMediaItem } from '@/components/home/hero-banner';
import MediaSlider from '@/components/media/media-slider';
import MediaCard, { MediaCardData } from '@/components/media/media-card';

// ==============================================================================
// Mock Data (Simulating API Responses)
// ==============================================================================

const HERO_ITEMS: HeroMediaItem[] = [
  {
    id: 'h1',
    title: 'Jujutsu Kaisen: Shibuya Incident',
    titleArabic: 'جوجوتسو كايسن: حادثة شيبويا',
    description: 'The story of Yuji Itadori and his fellow Jujutsu Sorcerers as they face the cursed spirits in the heart of Shibuya on Halloween night.',
    descriptionArabic: 'قصة يوجي إيتادوري ورفاقه من ساحري الجوجوتسو وهم يواجهون الأرواح الملعونة في قلب شيبويا في ليلة الهالوين.',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-392d1e6b1a3b?q=80&w=2560&auto=format&fit=crop',
    rating: 9.2,
    year: 2023,
    duration: '24m',
    genres: ['Action', 'Supernatural', 'Dark Fantasy'],
    href: '/anime/jujutsu-kaisen-season-2',
  },
  {
    id: 'h2',
    title: 'Frieren: Beyond Journey\'s End',
    titleArabic: 'فريرين: ما بعد نهاية الرحلة',
    description: 'An elf mage named Frieren reflects on her past adventures and the fleeting nature of human life after the death of her human companions.',
    descriptionArabic: 'تعكس الساحرة القزمة فريرين مغامراتها السابقة والطبيعة العابرة للحياة البشرية بعد وفاة رفاقها البشر.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2560&auto=format&fit=crop',
    rating: 9.4,
    year: 2023,
    duration: '24m',
    genres: ['Adventure', 'Drama', 'Fantasy'],
    href: '/anime/frieren',
  },
];

const TRENDING_MEDIA: MediaCardData[] = Array.from({ length: 10 }, (_, i) => ({
  id: `t${i}`,
  title: `Trending Anime ${i + 1}`,
  titleArabic: `أنمي رائج ${i + 1}`,
  slug: `trending-anime-${i + 1}`,
  type: 'ANIME',
  coverImage: `https://picsum.photos/seed/trending${i}/400/600`,
  rating: 8.0 + Math.random() * 1.5,
  year: 2023 - (i % 3),
  episodes: 12 + (i % 13),
  quality: i % 3 === 0 ? '4K' : i % 2 === 0 ? 'FHD' : 'HD',
  isTrending: true,
  href: `/anime/trending-anime-${i + 1}`,
}));

const LATEST_EPISODES: MediaCardData[] = Array.from({ length: 12 }, (_, i) => ({
  id: `l${i}`,
  title: `Latest Episode Release ${i + 1}`,
  titleArabic: `إصدار أحدث حلقة ${i + 1}`,
  slug: `latest-ep-${i + 1}`,
  type: 'ANIME',
  coverImage: `https://picsum.photos/seed/latest${i}/400/600`,
  rating: 7.5 + Math.random() * 2,
  year: 2024,
  currentEpisode: 5 + (i % 10),
  episodes: 24,
  quality: 'HD',
  isNew: true,
  href: `/anime/latest-ep-${i + 1}`,
}));

const POPULAR_MOVIES: MediaCardData[] = Array.from({ length: 8 }, (_, i) => ({
  id: `m${i}`,
  title: `Popular Anime Movie ${i + 1}`,
  titleArabic: `فيلم أنمي شهير ${i + 1}`,
  slug: `movie-${i + 1}`,
  type: 'MOVIE',
  coverImage: `https://picsum.photos/seed/movie${i}/400/600`,
  rating: 8.5 + Math.random(),
  year: 2020 + (i % 4),
  duration: '1h 45m',
  quality: '4K',
  href: `/movie/movie-${i + 1}`,
}));

const CONTINUE_WATCHING: MediaCardData[] = Array.from({ length: 5 }, (_, i) => ({
  id: `c${i}`,
  title: `Continue Watching Series ${i + 1}`,
  titleArabic: `متابعة مشاهدة مسلسل ${i + 1}`,
  slug: `continue-${i + 1}`,
  type: 'TV_SERIES',
  coverImage: `https://picsum.photos/seed/continue${i}/600/400`,
  rating: 8.0,
  year: 2023,
  currentEpisode: 3 + i,
  episodes: 12,
  quality: 'FHD',
  href: `/series/continue-${i + 1}`,
}));

// ==============================================================================
// Page Component
// ==============================================================================

export default async function HomePage() {
  const t = await getTranslations('home');

  return (
    <main className="min-h-screen bg-background">
      {/* ==========================================================================
          1. Hero Banner Section
          ========================================================================== */}
      <HeroBanner items={HERO_ITEMS} autoPlayInterval={7000} />

      {/* ==========================================================================
          2. Main Content Area (Overlapping the Hero slightly for depth)
          ========================================================================== */}
      <div className="relative z-10 -mt-20 md:-mt-32 space-y-8 pb-20">
        
        {/* Continue Watching (Only visible if user is logged in - mocked here) */}
        <MediaSlider title={t('sections.continueWatching')} viewAllLink="/profile/history">
          {CONTINUE_WATCHING.map((media, index) => (
            <div key={media.id} className="w-[280px] md:w-[320px] flex-shrink-0 snap-start">
              <MediaCard media={media} variant="continue" index={index} />
            </div>
          ))}
        </MediaSlider>

        {/* Trending Now */}
        <MediaSlider title={t('sections.trending')} viewAllLink="/browse?trending=true">
          {TRENDING_MEDIA.map((media, index) => (
            <div key={media.id} className="w-[160px] md:w-[200px] lg:w-[220px] flex-shrink-0 snap-start">
              <MediaCard media={media} variant="default" index={index} />
            </div>
          ))}
        </MediaSlider>

        {/* Latest Episodes */}
        <MediaSlider title={t('sections.latest')} viewAllLink="/browse?sort=newest">
          {LATEST_EPISODES.map((media, index) => (
            <div key={media.id} className="w-[160px] md:w-[200px] lg:w-[220px] flex-shrink-0 snap-start">
              <MediaCard media={media} variant="default" index={index} />
            </div>
          ))}
        </MediaSlider>

        {/* Popular Movies (Large Variant) */}
        <MediaSlider title={t('sections.movies')} viewAllLink="/browse?type=movie">
          {POPULAR_MOVIES.map((media, index) => (
            <div key={media.id} className="w-[280px] md:w-[350px] lg:w-[400px] flex-shrink-0 snap-start">
              <MediaCard media={media} variant="large" index={index} />
            </div>
          ))}
        </MediaSlider>

        {/* Most Popular */}
        <MediaSlider title={t('sections.popular')} viewAllLink="/browse?sort=popularity">
          {TRENDING_MEDIA.slice().reverse().map((media, index) => (
            <div key={media.id} className="w-[160px] md:w-[200px] lg:w-[220px] flex-shrink-0 snap-start">
              <MediaCard media={media} variant="default" index={index} />
            </div>
          ))}
        </MediaSlider>

      </div>
    </main>
  );
}
