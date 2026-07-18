/**
 * AniVerse Web - Media Details & Watch Page
 * 
 * The comprehensive page for viewing a specific Anime/Movie/Series.
 * Features:
 * - Server Component for SEO and fast initial load.
 * - Integrated Video Player.
 * - Episode List with progress tracking.
 * - Detailed metadata (Genres, Studios, Characters).
 * - Related Media slider.
 * - Comments & Reviews section.
 */

import React from 'react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Star, Calendar, Clock, Film, Tv, Heart, Share2, PlayCircle } from 'lucide-react';
import VideoPlayer from '@/components/video/video-player';
import MediaSlider from '@/components/media/media-slider';
import MediaCard, { MediaCardData } from '@/components/media/media-card';
import { cn, formatTime, formatCompactNumber } from '@/lib/utils';

// ==============================================================================
// Types & Interfaces
// ==============================================================================

interface Episode {
  id: string;
  number: number;
  title: string;
  duration: number;
  isWatched: boolean;
}

interface MediaDetails {
  id: string;
  title: string;
  titleArabic: string;
  slug: string;
  description: string;
  descriptionArabic: string;
  coverImage: string;
  bannerImage: string;
  rating: number;
  year: number;
  status: string;
  type: string;
  genres: string[];
  studios: string[];
  totalEpisodes: number;
  trailerUrl: string;
  episodes: Episode[];
}

// ==============================================================================
// Mock Data Fetching (Simulating Database/API Call)
// ==============================================================================

async function getMediaDetails(slug: string): Promise<MediaDetails | null> {
  // In a real app, this would be a Prisma query or API call.
  // For this MVP, we return mock data.
  if (!slug) return null;

  return {
    id: '1',
    title: 'Jujutsu Kaisen',
    titleArabic: 'جوجوتسو كايسن',
    slug: slug,
    description: 'Yuji Itadori is a boy with tremendous physical strength, though he lives a completely ordinary high school life. One day, to save a classmate who has been attacked by curses, he eats the finger of Ryomen Sukuna, taking the curse into his own soul.',
    descriptionArabic: 'يوجي إيتادوري هو فتى يتمتع بقوة جسدية هائلة، رغم أنه يعيش حياة مدرسية ثانوية عادية تماماً. في يوم من الأيام، لإنقاذ زميل في الفصل تعرض لهجوم من قبل اللعنات، يأكل إصبع ريومن سوكونا، آخذاً اللعنة إلى روحه الخاصة.',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-392d1e6b1a3b?q=80&w=800&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2560&auto=format&fit=crop',
    rating: 8.7,
    year: 2020,
    status: 'ONGOING',
    type: 'ANIME',
    genres: ['Action', 'Supernatural', 'School', 'Shounen'],
    studios: ['MAPPA'],
    totalEpisodes: 47,
    trailerUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // Standard HLS test stream
    episodes: Array.from({ length: 24 }, (_, i) => ({
      id: `ep-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      duration: 1440, // 24 minutes in seconds
      isWatched: i < 3,
    })),
  };
}

// ==============================================================================
// Page Component
// ==============================================================================

export default async function MediaDetailsPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const t = await getTranslations('common');
  const media = await getMediaDetails(slug);

  if (!media) {
    notFound();
  }

  const isArabic = locale === 'ar';
  const title = isArabic ? media.titleArabic : media.title;
  const description = isArabic ? media.descriptionArabic : media.description;

  // Mock related media
  const relatedMedia: MediaCardData[] = Array.from({ length: 8 }, (_, i) => ({
    id: `r${i}`,
    title: `Related Anime ${i + 1}`,
    titleArabic: `أنمي مشابه ${i + 1}`,
    slug: `related-${i + 1}`,
    type: 'ANIME',
    coverImage: `https://picsum.photos/seed/related${i}/400/600`,
    rating: 7.5 + Math.random() * 2,
    year: 2020 + (i % 4),
    episodes: 12 + (i % 13),
    quality: 'HD',
    href: `/anime/${locale}/related-${i + 1}`,
  }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ==========================================================================
          1. Banner & Video Player Section
          ========================================================================== */}
      <div className="relative w-full">
        {/* Background Banner Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center opacity-30 blur-sm"
            style={{ backgroundImage: `url(${media.bannerImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          {/* Video Player */}
          <div className="max-w-5xl mx-auto mb-10">
            <VideoPlayer
              sources={[{ src: media.trailerUrl, type: 'application/x-mpegURL' }]}
              poster={media.coverImage}
              title={title}
              className="shadow-2xl shadow-primary/10"
            />
          </div>

          {/* ==========================================================================
              2. Media Information Header
              ========================================================================== */}
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-border">
                <img 
                  src={media.coverImage} 
                  alt={title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
                  {title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-yellow-500 font-semibold">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    {media.rating}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {media.year}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Film className="w-4 h-4" />
                    {media.type}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-xs font-bold uppercase">
                    {media.status}
                  </span>
                </div>
              </div>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {description}
              </p>

              {/* Genres & Studios */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {media.genres.map((genre) => (
                    <span 
                      key={genre} 
                      className="px-3 py-1 rounded-full bg-muted text-sm font-medium text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Studios:</span>
                  {media.studios.join(', ')}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-glow hover:shadow-glow-lg active:scale-95">
                  <PlayCircle className="w-5 h-5" />
                  مشاهدة من البداية
                </button>
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-all active:scale-95">
                  <Heart className="w-5 h-5" />
                  إضافة للمفضلة
                </button>
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-all active:scale-95">
                  <Share2 className="w-5 h-5" />
                  مشاركة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          3. Episode List Section
          ========================================================================== */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Tv className="w-6 h-6 text-primary" />
              الحلقات ({media.totalEpisodes})
            </h2>
            <select className="bg-muted border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>الموسم 1</option>
              <option>الموسم 2</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {media.episodes.map((ep) => (
              <div 
                key={ep.id} 
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer hover:bg-muted/50",
                  ep.isWatched 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-card border-border hover:border-primary/50"
                )}
              >
                <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img 
                    src={`https://picsum.photos/seed/${media.slug}-ep${ep.number}/200/120`} 
                    alt={ep.title}
                    className="w-full h-full object-cover"
                  />
                  {ep.isWatched && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-primary fill-primary" />
                    </div>
                  )}
                  <div className="absolute bottom-1 end-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono">
                    {formatTime(ep.duration)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">الحلقة {ep.number}</p>
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {ep.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================================
          4. Related Media Slider
          ========================================================================== */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <MediaSlider title="أنمي مشابه" viewAllLink={`/anime/${locale}/related`}>
          {relatedMedia.map((media, index) => (
            <div key={media.id} className="w-[160px] md:w-[200px] lg:w-[220px] flex-shrink-0 snap-start">
              <MediaCard media={media} variant="default" index={index} />
            </div>
          ))}
        </MediaSlider>
      </section>
    </main>
  );
}
