import { PrismaClient } from '@prisma/client'

const DATABASE_URL = 'postgresql://neondb_owner:npg_VkIEZ8ON5dJx@ep-bold-union-atmkdz76-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'

const db = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } }
})

const JWT_SECRET = 'CryptoMine2026SecretKeyForJWTTokensRealData'

// Same hashing as auth.ts (Web Crypto API compatible)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + JWT_SECRET)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function main() {
  console.log('🔧 Fixing admin password hash...\n')

  const passwordHash = await hashPassword('admin123')
  console.log('Hash:', passwordHash)

  // Update admin password
  await db.user.update({
    where: { email: 'admin@cryptomine.io' },
    data: {
      passwordHash,
      balance: 0, // Reset admin balance to 0
    }
  })
  console.log('✅ Admin password updated')

  // Reset mshay2024 user balance to 0 (remove fake $25)
  const mshay = await db.user.findUnique({ where: { email: 'mshay2024m@gmail.com' } })
  if (mshay) {
    await db.user.update({
      where: { id: mshay.id },
      data: {
        balance: 0,
        totalProfit: 0,
        dailyProfit: 0,
        monthlyProfit: 0,
        points: 0,
        activePlanId: null,
        planActivatedAt: null,
        planExpiresAt: null,
      }
    })
    console.log('✅ Reset mshay2024 balance to 0')

    // Delete fake welcome bonus transaction
    await db.transaction.deleteMany({
      where: { userId: mshay.id, type: 'BONUS' }
    })
    console.log('✅ Deleted fake bonus transactions')
  }

  // Verify
  const admin = await db.user.findUnique({ where: { email: 'admin@cryptomine.io' } })
  console.log('\n=== VERIFICATION ===')
  console.log('Admin hash matches:', admin?.passwordHash === passwordHash)
  console.log('Admin balance:', admin?.balance)

  await db.$disconnect()
}

main().then(() => process.exit(0)).catch(e => { console.error('ERROR:', e); process.exit(1) })
