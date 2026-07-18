/**
 * AniVerse Prisma Client
 * 
 * Optimized Prisma Client instance with:
 * - Global singleton pattern for development
 * - Connection pooling configuration
 * - Query logging and performance monitoring
 * - Error handling and retry logic
 * - Transaction utilities
 */

import { PrismaClient } from '../generated/client';
import { Prisma } from '../generated/client';

// ==============================================================================
// Types
// ==============================================================================

export type PrismaClientOptions = {
  log?: Array<'query' | 'info' | 'warn' | 'error'>;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
};

// ==============================================================================
// Global Singleton (Prevents multiple instances in development)
// ==============================================================================

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// ==============================================================================
// Configuration
// ==============================================================================

const defaultOptions: PrismaClientOptions = {
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
};

// ==============================================================================
// Prisma Client Instance
// ==============================================================================

export const createPrismaClient = (options?: PrismaClientOptions): PrismaClient => {
  const config = { ...defaultOptions, ...options };

  const prisma = new PrismaClient({
    log: config.log,
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
        directUrl: process.env.DATABASE_DIRECT_URL,
      },
    },
  });

  // ============================================================================
  // Query Logging & Performance Monitoring
  // ============================================================================

  if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
      const duration = e.duration;
      const query = e.query;
      
      // Log slow queries
      if (duration > 1000) {
        console.warn(`⚠️  Slow Query (${duration}ms):`, query.substring(0, 200));
      }
    });

    prisma.$on('info', (e) => {
      console.info(`📊 Prisma Info:`, e.message);
    });

    prisma.$on('warn', (e) => {
      console.warn(`️  Prisma Warning:`, e.message);
    });
  }

  prisma.$on('error', (e) => {
    console.error(`❌ Prisma Error:`, e.message, e.target);
  });

  return prisma;
};

// ==============================================================================
// Retry Logic
// ==============================================================================

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; retryDelay?: number } = {}
): Promise<T> => {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on certain errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Don't retry on validation errors, unique constraint violations, etc.
        if (['P2002', 'P2003', 'P2025'].includes(error.code)) {
          throw error;
        }
      }

      if (attempt < maxRetries) {
        console.warn(`️  Attempt ${attempt} failed, retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
  }

  throw lastError!;
};

// ==============================================================================
// Transaction Utilities
// ==============================================================================

export const runTransaction = async <T>(
  prisma: PrismaClient,
  fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>,
  options?: { maxWait?: number; timeout?: number }
): Promise<T> => {
  return prisma.$transaction(fn, options);
};

export const runInteractiveTransaction = async <T>(
  prisma: PrismaClient,
  fn: (tx: PrismaClient) => Promise<T>,
  options?: { maxWait?: number; timeout?: number }
): Promise<T> => {
  return prisma.$transaction(fn, options);
};

// ==============================================================================
// Singleton Instance (Development Only)
// ==============================================================================

export const getPrismaClient = (): PrismaClient => {
  if (process.env.NODE_ENV === 'production') {
    return createPrismaClient();
  }

  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }

  return global.prisma;
};

// ==============================================================================
// Health Check
// ==============================================================================

export const checkDatabaseHealth = async (prisma: PrismaClient): Promise<{
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  error?: string;
}> => {
  const startTime = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;

    return {
      status: responseTime < 1000 ? 'healthy' : 'unhealthy',
      responseTime,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// ==============================================================================
// Connection Pool Management
// ==============================================================================

export const disconnectPrisma = async (prisma: PrismaClient): Promise<void> => {
  await prisma.$disconnect();
};

export const connectPrisma = async (prisma: PrismaClient): Promise<void> => {
  await prisma.$connect();
};

// ==============================================================================
// Export Default Instance
// ==============================================================================

const prisma = getPrismaClient();

export default prisma;

// ==============================================================================
// Type Exports
// ==============================================================================

export type { PrismaClient } from '../generated/client';
export { Prisma } from '../generated/client';

// Re-export all models and types
export * from '../generated/client';
