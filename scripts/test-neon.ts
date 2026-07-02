import { PrismaClient } from '@prisma/client'

const DATABASE_URL = 'postgresql://neondb_owner:npg_VkIEZ8ON5dJx@ep-bold-union-atmkdz76-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'

const db = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } }
})

async function main() {
  console.log('Testing Neon connection...')
  const tables = await db.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'` as any[]
  console.log('Tables found:', tables.length)
  console.log(tables.map(t => t.table_name))
  await db.$disconnect()
}

main().then(() => process.exit(0)).catch(e => { console.error('ERROR:', e.message); process.exit(1) })
