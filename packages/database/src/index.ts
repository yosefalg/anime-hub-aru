/**
 * AniVerse Database Package - Main Entry Point
 * 
 * This file serves as the public API for the @aniverse/database package.
 * It exports the Prisma client instance, all generated models, types, 
 * enums, and custom database utilities.
 * 
 * Usage:
 * import prisma, { User, ContentType, withRetry } from '@aniverse/database';
 */

// ==============================================================================
// Prisma Client Instance & Utilities
// ==============================================================================

export {
  // Default singleton instance
  prisma,
  default,
  
  // Client creation and management
  getPrismaClient,
  createPrismaClient,
  connectPrisma,
  disconnectPrisma,
  
  // Advanced utilities
  withRetry,
  runTransaction,
  runInteractiveTransaction,
  checkDatabaseHealth,
} from './client';

// ==============================================================================
// Type Exports from Client Utilities
// ==============================================================================

export type { 
  PrismaClientOptions 
} from './client';

// ==============================================================================
// Prisma Generated Models, Types, and Enums
// ==============================================================================
// Re-exporting everything from the generated Prisma Client.
// This includes all Models (User, Media, Episode, etc.), 
// Enums (ContentType, UserRole, etc.), and Prisma namespace types.

export {
  Prisma,
  PrismaClient,
  
  // Enums
  ContentType,
  MediaStatus,
  UserRole,
  UserStatus,
  SubscriptionTier,
  VideoQuality,
  StreamingProtocol,
  SubtitleFormat,
  NotificationType,
  CommentType,
  ReportStatus,
  ReportType,
  AuditAction,
  Language,
  ReleaseType,
  AgeRating,
} from './generated/client';

// Export all generated types and models
export type {
  // Models
  User,
  UserAccount,
  UserSession,
  UserFollow,
  Media,
  Episode,
  Video,
  VideoThumbnail,
  Subtitle,
  SubtitleRating,
  Genre,
  Tag,
  Studio,
  Character,
  MediaCharacter,
  Staff,
  MediaStaff,
  VoiceActor,
  MediaRelation,
  Recommendation,
  WatchHistory,
  Watchlist,
  Favorite,
  Rating,
  Review,
  Comment,
  Playlist,
  PlaylistMedia,
  Notification,
  NewsArticle,
  ExternalId,
  Report,
  AuditLog,
  Achievement,
  UserAchievement,
  MediaUpload,
  SystemConfig,
  Analytics,

  // Where/Select/Include types for complex queries
  UserWhereInput,
  UserWhereUniqueInput,
  UserCreateInput,
  UserUpdateInput,
  MediaWhereInput,
  MediaWhereUniqueInput,
  MediaCreateInput,
  MediaUpdateInput,
  EpisodeWhereInput,
  EpisodeWhereUniqueInput,
  EpisodeCreateInput,
  EpisodeUpdateInput,
  
  // And any other generated types
  [key: string]: any;
} from './generated/client';

// ==============================================================================
// Custom Database Helpers (Future Extensions)
// ==============================================================================

/**
 * Helper to safely parse BigInt values to strings for JSON serialization.
 * Prisma returns BigInt for some fields, which JSON.stringify doesn't support by default.
 */
export const serializeBigInt = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
    );
  }
  return obj;
};

/**
 * Helper to calculate pagination metadata.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const getPaginationMeta = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
