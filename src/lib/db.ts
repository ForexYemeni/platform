// Database client - works with or without DATABASE_URL
// On Vercel: set DATABASE_URL in Environment Variables to enable real database
// Without it: the app uses mock data (no crashes)

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Prisma client if DATABASE_URL is available
// This prevents crashes on Vercel when no database is configured
if (process.env.DATABASE_URL && !globalForPrisma.prisma) {
  try {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    })
  } catch (e) {
    console.warn('Prisma client initialization skipped (no database)')
  }
}

export const db = globalForPrisma.prisma ?? null
