import { PrismaClient } from '@prisma/client'

const DATABASE_URL = 'postgresql://neondb_owner:npg_VkIEZ8ON5dJx@ep-bold-union-atmkdz76-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'

const db = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } }
})

async function main() {
  console.log('=== DATABASE STATE ===\n')

  const users = await db.user.findMany()
  console.log(`Users (${users.length}):`)
  users.forEach(u => console.log(`  - ${u.email} | balance: $${u.balance} | isAdmin: ${u.isAdmin}`))

  const plans = await db.plan.findMany()
  console.log(`\nPlans (${plans.length}):`)
  plans.forEach(p => console.log(`  - ${p.name} | $${p.investment} | ${p.dailyProfit}%/day | active: ${p.active}`))

  const tasks = await db.task.findMany()
  console.log(`\nTasks (${tasks.length}):`)
  tasks.forEach(t => console.log(`  - ${t.title} | reward: ${t.reward} ${t.rewardType} | active: ${t.active}`))

  const wallets = await db.walletAddress.findMany()
  console.log(`\nWallet Addresses (${wallets.length}):`)
  wallets.forEach(w => console.log(`  - ${w.currency} (${w.network}) | active: ${w.active}`))

  const deposits = await db.deposit.findMany()
  console.log(`\nDeposits (${deposits.length})`)

  await db.$disconnect()
}

main().then(() => process.exit(0)).catch(e => { console.error('ERROR:', e.message); process.exit(1) })
