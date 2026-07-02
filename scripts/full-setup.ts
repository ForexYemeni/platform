import { PrismaClient } from '@prisma/client'

const DATABASE_URL = 'postgresql://neondb_owner:npg_VkIEZ8ON5dJx@ep-bold-union-atmkdz76-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'

const db = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } }
})

async function main() {
  console.log('🚀 Full database reset and setup...\n')

  // Step 1: Drop ALL tables and types
  console.log('📡 Step 1: Dropping all tables and types...')
  const dropStmts = [
    `DROP TABLE IF EXISTS "AdminLog" CASCADE`,
    `DROP TABLE IF EXISTS "WalletAddress" CASCADE`,
    `DROP TABLE IF EXISTS "Session" CASCADE`,
    `DROP TABLE IF EXISTS "Notification" CASCADE`,
    `DROP TABLE IF EXISTS "UserTask" CASCADE`,
    `DROP TABLE IF EXISTS "Task" CASCADE`,
    `DROP TABLE IF EXISTS "ReferralEarning" CASCADE`,
    `DROP TABLE IF EXISTS "Transaction" CASCADE`,
    `DROP TABLE IF EXISTS "Withdrawal" CASCADE`,
    `DROP TABLE IF EXISTS "Deposit" CASCADE`,
    `DROP TABLE IF EXISTS "AdminSettings" CASCADE`,
    `DROP TABLE IF EXISTS "User" CASCADE`,
    `DROP TABLE IF EXISTS "Plan" CASCADE`,
  ]
  for (const s of dropStmts) {
    try { await db.$executeRawUnsafe(s) } catch (e) {}
  }
  console.log('✅ All tables dropped\n')

  // Step 2: Create all tables with TEXT columns (no enums)
  console.log('📡 Step 2: Creating all tables...')
  const createStmts = [
    `CREATE TABLE "User" (
      "id" TEXT NOT NULL, "email" TEXT NOT NULL, "name" TEXT, "passwordHash" TEXT,
      "avatar" TEXT, "phone" TEXT, "country" TEXT,
      "role" TEXT NOT NULL DEFAULT 'USER', "isAdmin" BOOLEAN NOT NULL DEFAULT false,
      "balance" DOUBLE PRECISION NOT NULL DEFAULT 0, "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "dailyProfit" DOUBLE PRECISION NOT NULL DEFAULT 0, "monthlyProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "points" INTEGER NOT NULL DEFAULT 0, "vipLevel" INTEGER NOT NULL DEFAULT 1,
      "referralCode" TEXT NOT NULL, "referredById" TEXT,
      "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false, "twoFactorSecret" TEXT,
      "emailVerified" BOOLEAN NOT NULL DEFAULT false, "isBlocked" BOOLEAN NOT NULL DEFAULT false,
      "isBanned" BOOLEAN NOT NULL DEFAULT false, "googleId" TEXT, "telegramId" TEXT, "appleId" TEXT,
      "lastLogin" TIMESTAMP(3), "lastActive" TIMESTAMP(3), "activePlanId" TEXT,
      "planActivatedAt" TIMESTAMP(3), "planExpiresAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE UNIQUE INDEX "User_email_key" ON "User"("email")`,
    `CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode")`,

    `CREATE TABLE "Plan" (
      "id" TEXT NOT NULL, "name" TEXT NOT NULL, "nameAr" TEXT NOT NULL,
      "investment" DOUBLE PRECISION NOT NULL, "dailyProfit" DOUBLE PRECISION NOT NULL,
      "duration" INTEGER NOT NULL, "hashrate" TEXT NOT NULL, "color" TEXT NOT NULL,
      "gradient" TEXT NOT NULL, "icon" TEXT NOT NULL,
      "popular" BOOLEAN NOT NULL DEFAULT false, "active" BOOLEAN NOT NULL DEFAULT true,
      "features" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE "Deposit" (
      "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "amount" DOUBLE PRECISION NOT NULL,
      "currency" TEXT NOT NULL, "network" TEXT NOT NULL, "txHash" TEXT, "address" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING', "confirmations" INTEGER NOT NULL DEFAULT 0,
      "requiredConfirmations" INTEGER NOT NULL DEFAULT 3,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE "Withdrawal" (
      "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "amount" DOUBLE PRECISION NOT NULL,
      "currency" TEXT NOT NULL, "network" TEXT NOT NULL, "address" TEXT NOT NULL,
      "fee" DOUBLE PRECISION NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING',
      "txHash" TEXT, "processedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE "Transaction" (
      "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "type" TEXT NOT NULL,
      "amount" DOUBLE PRECISION NOT NULL, "currency" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'COMPLETED', "description" TEXT, "txHash" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE "ReferralEarning" (
      "id" TEXT NOT NULL, "referrerId" TEXT NOT NULL, "referredId" TEXT NOT NULL,
      "level" INTEGER NOT NULL, "percentage" DOUBLE PRECISION NOT NULL,
      "amount" DOUBLE PRECISION NOT NULL, "source" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ReferralEarning_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE "Task" (
      "id" TEXT NOT NULL, "title" TEXT NOT NULL, "titleAr" TEXT NOT NULL,
      "description" TEXT NOT NULL, "descriptionAr" TEXT NOT NULL, "type" TEXT NOT NULL,
      "reward" DOUBLE PRECISION NOT NULL, "rewardType" TEXT NOT NULL, "icon" TEXT NOT NULL,
      "total" INTEGER, "active" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE "UserTask" (
      "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "taskId" TEXT NOT NULL,
      "progress" INTEGER NOT NULL DEFAULT 0, "completed" BOOLEAN NOT NULL DEFAULT false,
      "claimed" BOOLEAN NOT NULL DEFAULT false, "completedAt" TIMESTAMP(3), "claimedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "UserTask_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "UserTask_userId_taskId_key" UNIQUE ("userId", "taskId")
    )`,

    `CREATE TABLE "Notification" (
      "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "type" TEXT NOT NULL,
      "title" TEXT NOT NULL, "message" TEXT NOT NULL, "read" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE "AdminSettings" (
      "id" TEXT NOT NULL, "platformName" TEXT NOT NULL DEFAULT 'CryptoMine 2026',
      "maintenanceMode" BOOLEAN NOT NULL DEFAULT false, "signupEnabled" BOOLEAN NOT NULL DEFAULT true,
      "minWithdrawalUsd" DOUBLE PRECISION NOT NULL DEFAULT 20,
      "defaultWithdrawalFee" DOUBLE PRECISION NOT NULL DEFAULT 1,
      "recaptchaEnabled" BOOLEAN NOT NULL DEFAULT false,
      "binanceApiKey" TEXT, "coinbaseApiKey" TEXT, "telegramBotToken" TEXT,
      "telegramBotUsername" TEXT, "smtpHost" TEXT, "smtpPort" INTEGER,
      "smtpUser" TEXT, "smtpPass" TEXT, "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "AdminSettings_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE "Session" (
      "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "token" TEXT NOT NULL,
      "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token")`,

    `CREATE TABLE "WalletAddress" (
      "id" TEXT NOT NULL, "currency" TEXT NOT NULL, "network" TEXT NOT NULL,
      "address" TEXT NOT NULL, "qrCode" TEXT, "label" TEXT,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "WalletAddress_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE "AdminLog" (
      "id" TEXT NOT NULL, "adminId" TEXT NOT NULL, "action" TEXT NOT NULL,
      "target" TEXT, "details" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
    )`,

    // Indexes
    `CREATE INDEX "User_email_idx" ON "User"("email")`,
    `CREATE INDEX "User_referralCode_idx" ON "User"("referralCode")`,
    `CREATE INDEX "User_referredById_idx" ON "User"("referredById")`,
    `CREATE INDEX "Deposit_userId_idx" ON "Deposit"("userId")`,
    `CREATE INDEX "Deposit_status_idx" ON "Deposit"("status")`,
    `CREATE INDEX "Withdrawal_userId_idx" ON "Withdrawal"("userId")`,
    `CREATE INDEX "Withdrawal_status_idx" ON "Withdrawal"("status")`,
    `CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId")`,
    `CREATE INDEX "Transaction_type_idx" ON "Transaction"("type")`,
    `CREATE INDEX "ReferralEarning_referrerId_idx" ON "ReferralEarning"("referrerId")`,
    `CREATE INDEX "ReferralEarning_referredId_idx" ON "ReferralEarning"("referredId")`,
    `CREATE INDEX "UserTask_userId_idx" ON "UserTask"("userId")`,
    `CREATE INDEX "Notification_userId_idx" ON "Notification"("userId")`,
    `CREATE INDEX "Notification_read_idx" ON "Notification"("read")`,
    `CREATE INDEX "Session_userId_idx" ON "Session"("userId")`,
    `CREATE INDEX "Session_token_idx" ON "Session"("token")`,
    `CREATE INDEX "WalletAddress_currency_idx" ON "WalletAddress"("currency")`,
    `CREATE INDEX "WalletAddress_active_idx" ON "WalletAddress"("active")`,
    `CREATE INDEX "AdminLog_adminId_idx" ON "AdminLog"("adminId")`,

    // Foreign keys
    `ALTER TABLE "User" ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User"("id") ON DELETE SET NULL`,
    `ALTER TABLE "User" ADD CONSTRAINT "User_activePlanId_fkey" FOREIGN KEY ("activePlanId") REFERENCES "Plan"("id") ON DELETE SET NULL`,
    `ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
    `ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
    `ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
    `ALTER TABLE "ReferralEarning" ADD CONSTRAINT "ReferralEarning_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE`,
    `ALTER TABLE "ReferralEarning" ADD CONSTRAINT "ReferralEarning_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "User"("id")`,
    `ALTER TABLE "UserTask" ADD CONSTRAINT "UserTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
    `ALTER TABLE "UserTask" ADD CONSTRAINT "UserTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id")`,
    `ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
    `ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
  ]

  for (const s of createStmts) {
    try { await db.$executeRawUnsafe(s) } catch (e: any) {
      console.error('SQL error:', e.message.substring(0, 80))
    }
  }
  console.log('✅ All 13 tables created\n')

  // Step 3: Hash password
  console.log('📡 Step 3: Creating admin user...')
  const crypto = require('crypto')
  const hashPassword = (pwd: string) => {
    return crypto.createHash('sha256').update(pwd + 'fallback-secret-change-me').digest('hex')
  }

  await db.user.create({
    data: {
      name: 'Platform Admin',
      email: 'admin@cryptomine.io',
      passwordHash: hashPassword('admin123'),
      referralCode: 'ADMIN001',
      isAdmin: true,
      role: 'ADMIN',
      balance: 0, // Admin starts with 0 too
      vipLevel: 5,
      emailVerified: true,
    }
  })
  console.log('✅ Admin created: admin@cryptomine.io / admin123')

  // Step 4: Create plans
  console.log('\n📡 Step 4: Creating 4 mining plans...')
  const plans = [
    { name: 'Basic', nameAr: 'الأساسية', investment: 50, dailyProfit: 2, duration: 30, hashrate: '0.5 TH/s', color: '#10b981', gradient: 'from-emerald-500 to-teal-600', icon: 'bronze', popular: false, active: true, features: [{ ar: '2% daily', en: '2% daily' }] },
    { name: 'Silver', nameAr: 'الفضية', investment: 200, dailyProfit: 3, duration: 45, hashrate: '2.0 TH/s', color: '#94a3b8', gradient: 'from-slate-400 to-slate-600', icon: 'silver', popular: false, active: true, features: [{ ar: '3% daily', en: '3% daily' }] },
    { name: 'Gold', nameAr: 'الذهبية', investment: 500, dailyProfit: 4, duration: 60, hashrate: '5.0 TH/s', color: '#f59e0b', gradient: 'from-amber-400 to-yellow-600', icon: 'gold', popular: true, active: true, features: [{ ar: '4% daily', en: '4% daily' }] },
    { name: 'Diamond', nameAr: 'الماسية', investment: 1000, dailyProfit: 5, duration: 90, hashrate: '15.0 TH/s', color: '#a855f7', gradient: 'from-purple-500 via-fuchsia-500 to-pink-500', icon: 'diamond', popular: false, active: true, features: [{ ar: '5% daily', en: '5% daily' }] },
  ]
  for (const p of plans) await db.plan.create({ data: p })
  console.log('✅ Created 4 plans')

  // Step 5: Create tasks
  console.log('\n📡 Step 5: Creating 8 tasks...')
  const tasks = [
    { title: 'Daily Check-in', titleAr: 'تسجيل الدخول اليومي', description: 'Log in daily', descriptionAr: 'سجل دخولك يومياً', type: 'DAILY', reward: 1, rewardType: 'USDT', icon: '📅', active: true },
    { title: 'Watch Video', titleAr: 'شاهد فيديو', description: 'Watch a video', descriptionAr: 'شاهد فيديو', type: 'DAILY', reward: 2.5, rewardType: 'USDT', icon: '🎬', active: true },
    { title: 'Follow on X', titleAr: 'تابعنا على X', description: 'Follow us', descriptionAr: 'تابعنا', type: 'DAILY', reward: 50, rewardType: 'POINTS', icon: '𝕏', active: true },
    { title: 'Invite Friend', titleAr: 'ادعُ صديقاً', description: 'Invite a friend', descriptionAr: 'ادعُ صديقاً', type: 'DAILY', reward: 5, rewardType: 'USDT', icon: '👥', total: 1, active: true },
    { title: 'Share Link', titleAr: 'شارك الرابط', description: 'Share your link', descriptionAr: 'شارك رابطك', type: 'DAILY', reward: 1.5, rewardType: 'USDT', icon: '🔗', active: true },
    { title: 'Invite 5 Friends', titleAr: 'ادعُ 5 أصدقاء', description: 'Invite 5 friends', descriptionAr: 'ادعُ 5 أصدقاء', type: 'WEEKLY', reward: 50, rewardType: 'USDT', icon: '🎯', total: 5, active: true },
    { title: 'Invest $1000', titleAr: 'استثمر 1000$', description: 'Invest $1000', descriptionAr: 'استثمر 1000$', type: 'WEEKLY', reward: 500, rewardType: 'POINTS', icon: '💰', total: 1000, active: true },
    { title: 'Gold VIP', titleAr: 'VIP الذهبي', description: 'Upgrade to Gold', descriptionAr: 'الترقية للذهبي', type: 'SPECIAL', reward: 25, rewardType: 'USDT', icon: '👑', active: true },
  ]
  for (const t of tasks) await db.task.create({ data: t })
  console.log('✅ Created 8 tasks')

  // Step 6: Admin settings
  await db.adminSettings.create({ data: { id: 'singleton' } })
  console.log('\n✅ Admin settings created')

  console.log('\n🎉 SETUP COMPLETE!')
  console.log('\n📋 Login: admin@cryptomine.io / admin123')
  console.log('📊 Database: Neon PostgreSQL (clean state)')

  await db.$disconnect()
}

main().then(() => process.exit(0)).catch(e => { console.error('ERROR:', e); process.exit(1) })
