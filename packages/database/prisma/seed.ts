/**
 * AniVerse Database Seeder
 * 
 * This script populates the database with essential initial data.
 * It is designed to be idempotent (safe to run multiple times) using upsert operations.
 * 
 * Run with: pnpm db:seed (from the monorepo root)
 */

import { PrismaClient } from '../src/generated/client';
import { createHash } from 'crypto';

// ==============================================================================
// Types & Interfaces
// ==============================================================================

interface SeedGenre {
  name: string;
  nameArabic: string;
  slug: string;
}

interface SeedStudio {
  name: string;
  nameArabic: string;
  slug: string;
  country: string;
}

// ==============================================================================
// Initialization
// ==============================================================================

const prisma = new PrismaClient();

// Helper to hash passwords for the seed (using SHA-256 for simplicity in seed, 
// in production NestJS will use bcrypt via Passport).
const hashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex');
};

// ==============================================================================
// Seed Data
// ==============================================================================

const genres: SeedGenre[] = [
  { name: 'Action', nameArabic: 'أكشن', slug: 'action' },
  { name: 'Adventure', nameArabic: 'مغامرة', slug: 'adventure' },
  { name: 'Comedy', nameArabic: 'كوميدي', slug: 'comedy' },
  { name: 'Drama', nameArabic: 'دراما', slug: 'drama' },
  { name: 'Fantasy', nameArabic: 'فانتازيا', slug: 'fantasy' },
  { name: 'Sci-Fi', nameArabic: 'خيال علمي', slug: 'sci-fi' },
  { name: 'Slice of Life', nameArabic: 'شريحة من الحياة', slug: 'slice-of-life' },
  { name: 'Supernatural', nameArabic: 'خارق للطبيعة', slug: 'supernatural' },
  { name: 'Thriller', nameArabic: 'إثارة', slug: 'thriller' },
  { name: 'Romance', nameArabic: 'رومانسي', slug: 'romance' },
];

const studios: SeedStudio[] = [
  { name: 'Ufotable', nameArabic: 'يوفوتيبل', slug: 'ufotable', country: 'Japan' },
  { name: 'MAPPA', nameArabic: 'مابا', slug: 'mappa', country: 'Japan' },
  { name: 'Kyoto Animation', nameArabic: 'كيوتو أنيميشن', slug: 'kyoto-animation', country: 'Japan' },
  { name: 'Studio Ghibli', nameArabic: 'ستوديو جيبلي', slug: 'studio-ghibli', country: 'Japan' },
  { name: 'Wit Studio', nameArabic: 'ويت ستوديو', slug: 'wit-studio', country: 'Japan' },
  { name: 'Bones', nameArabic: 'بونز', slug: 'bones', country: 'Japan' },
  { name: 'Madhouse', nameArabic: 'مادهاوس', slug: 'madhouse', country: 'Japan' },
  { name: 'A-1 Pictures', nameArabic: 'إيه-1 بيكتشرز', slug: 'a-1-pictures', country: 'Japan' },
];

// ==============================================================================
// Main Seeder Function
// ==============================================================================

async function main() {
  console.log('🌱 Starting AniVerse Database Seeder...');
  console.log('----------------------------------------');

  try {
    // --------------------------------------------------------------------------
    // 1. Seed System Configuration
    // --------------------------------------------------------------------------
    console.log('📦 Seeding System Configurations...');
    await prisma.systemConfig.upsert({
      where: { key: 'platform_name' },
      update: { value: { en: 'AniVerse', ar: 'أنيفيرس' } },
      create: { 
        key: 'platform_name', 
        value: { en: 'AniVerse', ar: 'أنيفيرس' },
        category: 'general'
      },
    });
    
    await prisma.systemConfig.upsert({
      where: { key: 'maintenance_mode' },
      update: { value: false },
      create: { 
        key: 'maintenance_mode', 
        value: false,
        category: 'general'
      },
    });

    // --------------------------------------------------------------------------
    // 2. Seed Genres
    // --------------------------------------------------------------------------
    console.log('🎭 Seeding Genres...');
    for (const genre of genres) {
      await prisma.genre.upsert({
        where: { slug: genre.slug },
        update: { nameArabic: genre.nameArabic },
        create: {
          name: genre.name,
          nameArabic: genre.nameArabic,
          slug: genre.slug,
        },
      });
    }

    // --------------------------------------------------------------------------
    // 3. Seed Studios
    // --------------------------------------------------------------------------
    console.log('🎬 Seeding Studios...');
    for (const studio of studios) {
      await prisma.studio.upsert({
        where: { slug: studio.slug },
        update: { nameArabic: studio.nameArabic, country: studio.country },
        create: {
          name: studio.name,
          nameArabic: studio.nameArabic,
          slug: studio.slug,
          country: studio.country,
        },
      });
    }

    // --------------------------------------------------------------------------
    // 4. Seed Admin User
    // --------------------------------------------------------------------------
    console.log('👤 Seeding Admin User...');
    const adminPassword = hashPassword('admin123'); // Default password for seed
    
    await prisma.user.upsert({
      where: { email: 'admin@aniverse.com' },
      update: { 
        role: 'SUPER_ADMIN',
        status: 'ACTIVE'
      },
      create: {
        email: 'admin@aniverse.com',
        username: 'admin',
        displayName: 'AniVerse Admin',
        password: adminPassword,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    // --------------------------------------------------------------------------
    // 5. Seed Sample Media (Anime)
    // --------------------------------------------------------------------------
    console.log('📺 Seeding Sample Media...');
    
    // Get some created genres and studios to link them
    const actionGenre = await prisma.genre.findUnique({ where: { slug: 'action' } });
    const fantasyGenre = await prisma.genre.findUnique({ where: { slug: 'fantasy' } });
    const ufotable = await prisma.studio.findUnique({ where: { slug: 'ufotable' } });

    if (actionGenre && fantasyGenre && ufotable) {
      const media = await prisma.media.upsert({
        where: { slug: 'demon-slayer-kimetsu-no-yaiba' },
        update: {
          titleArabic: 'قاتل الشياطين',
          descriptionArabic: 'تانجيرو كامادو، فتى طيب القلب يكسب عيشه ببيع الفحم. تتغير حياته عندما تُذبح عائلته على يد شيطان، وتتحول أخته الصغرى نيزوكو إلى شيطان.',
        },
        create: {
          title: 'Demon Slayer: Kimetsu no Yaiba',
          titleNative: '鬼滅の刃',
          titleArabic: 'قاتل الشياطين',
          slug: 'demon-slayer-kimetsu-no-yaiba',
          description: 'A youth begins a quest to fight demons and save his sister after his family is slaughtered and his sister is turned into a demon.',
          descriptionArabic: 'تانجيرو كامادو، فتى طيب القلب يكسب عيشه ببيع الفحم. تتغير حياته عندما تُذبح عائلته على يد شيطان، وتتحول أخته الصغرى نيزوكو إلى شيطان.',
          type: 'ANIME',
          status: 'COMPLETED',
          releaseType: 'TV',
          season: 1,
          seasonYear: 2019,
          episodes: 26,
          duration: 24,
          country: 'Japan',
          ageRating: 'R17',
          averageScore: 8.5,
          popularity: 95000,
          trending: 100,
          published: true,
          publishedAt: new Date('2019-04-06'),
          genres: { connect: [{ id: actionGenre.id }, { id: fantasyGenre.id }] },
          studios: { connect: [{ id: ufotable.id }] },
        },
      });

      // Seed Episodes for the Anime
      console.log('📼 Seeding Sample Episodes...');
      for (let i = 1; i <= 3; i++) {
        await prisma.episode.upsert({
          where: { 
            mediaId_episodeNumber: { 
              mediaId: media.id, 
              episodeNumber: i 
            } 
          },
          update: {},
          create: {
            mediaId: media.id,
            episodeNumber: i,
            title: `Episode ${i}`,
            titleArabic: `الحلقة ${i}`,
            description: `Description for episode ${i}.`,
            descriptionArabic: `وصف الحلقة ${i}.`,
            duration: 24,
            published: true,
            publishedAt: new Date(`2019-04-${5 + i}`),
          },
        });
      }
    }

    // --------------------------------------------------------------------------
    // 6. Seed Achievements (Gamification)
    // --------------------------------------------------------------------------
    console.log('🏆 Seeding Achievements...');
    await prisma.achievement.upsert({
      where: { id: 'ach_first_watch' },
      update: {},
      create: {
        id: 'ach_first_watch',
        name: 'First Steps',
        nameArabic: 'الخطوات الأولى',
        description: 'Watch your first episode.',
        descriptionArabic: 'شاهد أول حلقة لك.',
        category: 'watching',
        points: 10,
        rarity: 'COMMON',
      },
    });

    await prisma.achievement.upsert({
      where: { id: 'ach_binge_watcher' },
      update: {},
      create: {
        id: 'ach_binge_watcher',
        name: 'Binge Watcher',
        nameArabic: 'مشاهد نهم',
        description: 'Watch 100 episodes.',
        descriptionArabic: 'شاهد 100 حلقة.',
        category: 'watching',
        points: 100,
        rarity: 'RARE',
      },
    });

    console.log('----------------------------------------');
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// ==============================================================================
// Execute Seeder
// ==============================================================================

main();
