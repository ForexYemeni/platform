import { PrismaClient } from '@prisma/client'

const DATABASE_URL = 'postgresql://neondb_owner:npg_VkIEZ8ON5dJx@ep-bold-union-atmkdz76-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'

const db = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } })

async function main() {
  console.log('🔧 Adding mining system columns...')

  // Add columns to User table
  const userColumns = [
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastMiningActivation" TIMESTAMP(3)`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "miningExpiresAt" TIMESTAMP(3)`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "miningAutoRenew" BOOLEAN NOT NULL DEFAULT false`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "accumulatedProfit" DOUBLE PRECISION NOT NULL DEFAULT 0`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totalMiningDays" INTEGER NOT NULL DEFAULT 0`,
  ]

  for (const s of userColumns) {
    try { await db.$executeRawUnsafe(s); console.log('✅', s.substring(50, 100)) }
    catch (e: any) { console.error('❌', e.message.substring(0, 80)) }
  }

  // Add columns to AdminSettings table
  const settingsColumns = [
    `ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "miningMode" TEXT NOT NULL DEFAULT 'manual'`,
    `ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "miningStartTime" INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "miningDurationHours" INTEGER NOT NULL DEFAULT 24`,
    `ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "miningAutoRenewDefault" BOOLEAN NOT NULL DEFAULT false`,
    `ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "minMiningBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.01`,
  ]

  for (const s of settingsColumns) {
    try { await db.$executeRawUnsafe(s); console.log('✅', s.substring(50, 100)) }
    catch (e: any) { console.error('❌', e.message.substring(0, 80)) }
  }

  console.log('\n🎉 Mining columns added!')
  await db.$disconnect()
}

main().then(() => process.exit(0)).catch(e => { console.error('ERROR:', e); process.exit(1) })
