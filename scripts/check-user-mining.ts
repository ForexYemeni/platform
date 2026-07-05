import { PrismaClient } from '@prisma/client'
const db = new PrismaClient({ datasources: { db: { url: 'postgresql://neondb_owner:npg_VkIEZ8ON5dJx@ep-bold-union-atmkdz76-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require' } } })

async function main() {
  const users = await db.user.findMany({
    select: { id: true, name: true, email: true, miningExpiresAt: true, lastMiningActivation: true }
  })
  for (const u of users) {
    console.log(`${u.email}: miningExpiresAt=${u.miningExpiresAt}, lastActivation=${u.lastMiningActivation}`)
  }
  await db.$disconnect()
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
