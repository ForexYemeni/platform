import { PrismaClient } from '@prisma/client'
const db = new PrismaClient({ datasources: { db: { url: 'postgresql://neondb_owner:npg_VkIEZ8ON5dJx@ep-bold-union-atmkdz76-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require' } } })

async function main() {
  // Reset all mining sessions
  await db.user.updateMany({
    where: { miningExpiresAt: { not: null } },
    data: { lastMiningActivation: null, miningExpiresAt: null }
  })
  console.log('✅ All mining sessions reset')
  await db.$disconnect()
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
