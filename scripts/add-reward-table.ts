import { PrismaClient } from '@prisma/client'

const DATABASE_URL = 'postgresql://neondb_owner:npg_VkIEZ8ON5dJx@ep-bold-union-atmkdz76-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'

const db = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } }
})

async function main() {
  console.log('🔧 Adding Reward table...')

  // Create Reward table
  const stmts = [
    `CREATE TABLE IF NOT EXISTS "Reward" (
      "id" TEXT NOT NULL, "userId" TEXT NOT NULL,
      "title" TEXT NOT NULL, "titleAr" TEXT NOT NULL,
      "description" TEXT NOT NULL, "descriptionAr" TEXT NOT NULL,
      "amount" DOUBLE PRECISION NOT NULL, "currency" TEXT NOT NULL DEFAULT 'USDT',
      "type" TEXT NOT NULL DEFAULT 'GIFT', "icon" TEXT NOT NULL DEFAULT '🎁',
      "claimed" BOOLEAN NOT NULL DEFAULT false, "claimedAt" TIMESTAMP(3),
      "expiresAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE INDEX IF NOT EXISTS "Reward_userId_idx" ON "Reward"("userId")`,
    `CREATE INDEX IF NOT EXISTS "Reward_claimed_idx" ON "Reward"("claimed")`,
    `ALTER TABLE "Reward" ADD CONSTRAINT IF NOT EXISTS "Reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
  ]

  for (const s of stmts) {
    try { await db.$executeRawUnsafe(s); console.log('✅', s.substring(0, 50)) }
    catch (e: any) { console.error('❌', e.message.substring(0, 80)) }
  }

  console.log('\n🎉 Reward table ready!')
  await db.$disconnect()
}

main().then(() => process.exit(0)).catch(e => { console.error('ERROR:', e); process.exit(1) })
