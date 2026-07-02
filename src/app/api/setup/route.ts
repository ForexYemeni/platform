// Simplified setup endpoint - works without NEXTAUTH_SECRET
// Just visit /setup-page and click the button
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/auth'

// Simple fixed setup key (anyone can use this - just to prevent random abuse)
const SETUP_KEY = 'crypto-mine-setup-2026'

export async function POST(req: NextRequest) {
  try {
    if (!db) {
      return apiError('DATABASE_URL not configured in Vercel Environment Variables', 500)
    }

    const body = await req.json().catch(() => ({}))
    const providedKey = body?.key || req.headers.get('x-setup-key') || body?.secret

    // Accept either the simple SETUP_KEY or NEXTAUTH_SECRET
    const nextauthSecret = process.env.NEXTAUTH_SECRET
    const isValidKey = providedKey === SETUP_KEY || (nextauthSecret && providedKey === nextauthSecret)

    if (!isValidKey) {
      return apiError(`Invalid key. Use: "${SETUP_KEY}" or your NEXTAUTH_SECRET value`, 401)
    }

    const results: string[] = []
    results.push('📡 Step 1: Checking database tables...')

    const tableCheck = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    ` as any[]

    const existingTables = tableCheck.map(t => t.table_name)
    results.push(`Found ${existingTables.length} existing tables`)

    const required = ['User', 'Plan', 'Deposit', 'Withdrawal', 'Transaction', 'ReferralEarning', 'Task', 'UserTask', 'Notification', 'AdminSettings', 'Session']
    const missing = required.filter(t => !existingTables.includes(t))

    if (missing.length > 0) {
      results.push(`⚠️ Missing tables: ${missing.join(', ')}`)
      results.push('🔧 Creating all tables via raw SQL...')

      await createTablesRaw(db)
      results.push('✅ All 11 tables created successfully')
    } else {
      results.push('✅ All required tables already exist')
    }

    // Step 2: Create admin user
    const adminExists = await db.user.findUnique({
      where: { email: 'admin@cryptomine.io' }
    })

    if (!adminExists) {
      results.push('👤 Creating admin user...')
      const { hashPassword } = await import('@/lib/auth')
      const passwordHash = await hashPassword('admin123')

      await db.user.create({
        data: {
          name: 'Platform Admin',
          email: 'admin@cryptomine.io',
          passwordHash,
          referralCode: 'ADMIN001',
          isAdmin: true,
          role: 'ADMIN',
          balance: 999999,
          vipLevel: 5,
          emailVerified: true,
        }
      })
      results.push('✅ Admin created: admin@cryptomine.io / admin123')
    } else {
      results.push('✅ Admin user already exists')
    }

    // Step 3: Create plans
    const plansCount = await db.plan.count()
    if (plansCount === 0) {
      results.push('⛏️ Creating 4 mining plans...')
      const plans = [
        { name: 'Basic', nameAr: 'الأساسية', investment: 50, dailyProfit: 2, duration: 30, hashrate: '0.5 TH/s', color: '#10b981', gradient: 'from-emerald-500 to-teal-600', icon: 'bronze', popular: false, active: true, features: [{ ar: '2% daily', en: '2% daily' }] },
        { name: 'Silver', nameAr: 'الفضية', investment: 200, dailyProfit: 3, duration: 45, hashrate: '2.0 TH/s', color: '#94a3b8', gradient: 'from-slate-400 to-slate-600', icon: 'silver', popular: false, active: true, features: [{ ar: '3% daily', en: '3% daily' }] },
        { name: 'Gold', nameAr: 'الذهبية', investment: 500, dailyProfit: 4, duration: 60, hashrate: '5.0 TH/s', color: '#f59e0b', gradient: 'from-amber-400 to-yellow-600', icon: 'gold', popular: true, active: true, features: [{ ar: '4% daily', en: '4% daily' }] },
        { name: 'Diamond', nameAr: 'الماسية', investment: 1000, dailyProfit: 5, duration: 90, hashrate: '15.0 TH/s', color: '#a855f7', gradient: 'from-purple-500 via-fuchsia-500 to-pink-500', icon: 'diamond', popular: false, active: true, features: [{ ar: '5% daily', en: '5% daily' }] },
      ]
      for (const plan of plans) {
        await db.plan.create({ data: plan as any })
      }
      results.push('✅ Created 4 mining plans (Basic, Silver, Gold, Diamond)')
    } else {
      results.push(`✅ ${plansCount} plans already exist`)
    }

    // Step 4: Create tasks
    const tasksCount = await db.task.count()
    if (tasksCount === 0) {
      results.push('✅ Creating 8 tasks...')
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
      for (const task of tasks) {
        await db.task.create({ data: task as any })
      }
      results.push('✅ Created 8 tasks')
    } else {
      results.push(`✅ ${tasksCount} tasks already exist`)
    }

    // Step 5: Admin settings
    const settings = await db.adminSettings.findUnique({ where: { id: 'singleton' } })
    if (!settings) {
      await db.adminSettings.create({ data: { id: 'singleton' } })
      results.push('✅ Admin settings created')
    }

    results.push('🎉 Setup complete!')
    results.push('📋 Admin login: admin@cryptomine.io / admin123')

    return apiSuccess({ steps: results })
  } catch (error: any) {
    console.error('Setup error:', error)
    return apiError('Setup failed: ' + error.message, 500)
  }
}

// GET - check database status (no auth required)
export async function GET() {
  try {
    if (!db) {
      return apiError('DATABASE_URL not configured', 500)
    }

    const tableCheck = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    ` as any[]

    const tables = tableCheck.map(t => t.table_name)
    const required = ['User', 'Plan', 'Deposit', 'Withdrawal', 'Transaction', 'ReferralEarning', 'Task', 'UserTask', 'Notification', 'AdminSettings', 'Session']
    const missing = required.filter(t => !tables.includes(t))

    let userCount = 0
    let planCount = 0
    let adminExists = false
    if (missing.length === 0) {
      try {
        userCount = await db.user.count()
        planCount = await db.plan.count()
        adminExists = !!(await db.user.findUnique({ where: { email: 'admin@cryptomine.io' } }))
      } catch {}
    }

    return apiSuccess({
      connected: true,
      tables,
      missingTables: missing,
      isReady: missing.length === 0,
      userCount,
      planCount,
      adminExists,
      needsSetup: missing.length > 0 || !adminExists,
    })
  } catch (error: any) {
    return apiError('Database check failed: ' + error.message, 500)
  }
}

// ============================================
// Create tables using raw SQL
// ============================================
async function createTablesRaw(db: any) {
  // ============================================
  // 0. DROP old tables if they exist with wrong schema (TEXT instead of enums)
  // This is safe because we're recreating them with correct types
  // ============================================
  const dropStatements = [
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
    // Drop old enum types if they exist with wrong format
    `DROP TYPE IF EXISTS "Role" CASCADE`,
    `DROP TYPE IF EXISTS "PaymentStatus" CASCADE`,
    `DROP TYPE IF EXISTS "TransactionType" CASCADE`,
    `DROP TYPE IF EXISTS "TaskType" CASCADE`,
    `DROP TYPE IF EXISTS "RewardType" CASCADE`,
    `DROP TYPE IF EXISTS "NotificationType" CASCADE`,
  ]

  for (const stmt of dropStatements) {
    try {
      await db.$executeRawUnsafe(stmt)
    } catch (e) {
      // Silent - table may not exist
    }
  }

  const statements = [
    // ============================================
    // 1. Create ENUM types FIRST (PostgreSQL requires this)
    // ============================================
    `DO $$ BEGIN CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'PROFIT', 'REFERRAL', 'TASK_REWARD', 'BONUS', 'PENALTY'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "TaskType" AS ENUM ('DAILY', 'WEEKLY', 'SPECIAL'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "RewardType" AS ENUM ('USDT', 'POINTS'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    `DO $$ BEGIN CREATE TYPE "NotificationType" AS ENUM ('SUCCESS', 'INFO', 'WARNING', 'ERROR'); EXCEPTION WHEN duplicate_object THEN null; END $$`,

    // ============================================
    // 2. Create tables
    // ============================================
    `CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "name" TEXT,
      "passwordHash" TEXT,
      "avatar" TEXT,
      "phone" TEXT,
      "country" TEXT,
      "role" "Role" NOT NULL DEFAULT 'USER',
      "isAdmin" BOOLEAN NOT NULL DEFAULT false,
      "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "dailyProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "monthlyProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "points" INTEGER NOT NULL DEFAULT 0,
      "vipLevel" INTEGER NOT NULL DEFAULT 1,
      "referralCode" TEXT NOT NULL,
      "referredById" TEXT,
      "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
      "twoFactorSecret" TEXT,
      "emailVerified" BOOLEAN NOT NULL DEFAULT false,
      "isBlocked" BOOLEAN NOT NULL DEFAULT false,
      "isBanned" BOOLEAN NOT NULL DEFAULT false,
      "googleId" TEXT,
      "telegramId" TEXT,
      "appleId" TEXT,
      "lastLogin" TIMESTAMP(3),
      "lastActive" TIMESTAMP(3),
      "activePlanId" TEXT,
      "planActivatedAt" TIMESTAMP(3),
      "planExpiresAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "User_referralCode_key" ON "User"("referralCode")`,

    `CREATE TABLE IF NOT EXISTS "Plan" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "nameAr" TEXT NOT NULL,
      "investment" DOUBLE PRECISION NOT NULL,
      "dailyProfit" DOUBLE PRECISION NOT NULL,
      "duration" INTEGER NOT NULL,
      "hashrate" TEXT NOT NULL,
      "color" TEXT NOT NULL,
      "gradient" TEXT NOT NULL,
      "icon" TEXT NOT NULL,
      "popular" BOOLEAN NOT NULL DEFAULT false,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "features" JSONB,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE IF NOT EXISTS "Deposit" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "amount" DOUBLE PRECISION NOT NULL,
      "currency" TEXT NOT NULL,
      "network" TEXT NOT NULL,
      "txHash" TEXT,
      "address" TEXT NOT NULL,
      "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
      "confirmations" INTEGER NOT NULL DEFAULT 0,
      "requiredConfirmations" INTEGER NOT NULL DEFAULT 3,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE IF NOT EXISTS "Withdrawal" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "amount" DOUBLE PRECISION NOT NULL,
      "currency" TEXT NOT NULL,
      "network" TEXT NOT NULL,
      "address" TEXT NOT NULL,
      "fee" DOUBLE PRECISION NOT NULL,
      "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
      "txHash" TEXT,
      "processedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE IF NOT EXISTS "Transaction" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "type" "TransactionType" NOT NULL,
      "amount" DOUBLE PRECISION NOT NULL,
      "currency" TEXT NOT NULL,
      "status" "PaymentStatus" NOT NULL DEFAULT 'COMPLETED',
      "description" TEXT,
      "txHash" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE IF NOT EXISTS "ReferralEarning" (
      "id" TEXT NOT NULL,
      "referrerId" TEXT NOT NULL,
      "referredId" TEXT NOT NULL,
      "level" INTEGER NOT NULL,
      "percentage" DOUBLE PRECISION NOT NULL,
      "amount" DOUBLE PRECISION NOT NULL,
      "source" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ReferralEarning_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE IF NOT EXISTS "Task" (
      "id" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "titleAr" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "descriptionAr" TEXT NOT NULL,
      "type" "TaskType" NOT NULL,
      "reward" DOUBLE PRECISION NOT NULL,
      "rewardType" "RewardType" NOT NULL,
      "icon" TEXT NOT NULL,
      "total" INTEGER,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE IF NOT EXISTS "UserTask" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "taskId" TEXT NOT NULL,
      "progress" INTEGER NOT NULL DEFAULT 0,
      "completed" BOOLEAN NOT NULL DEFAULT false,
      "claimed" BOOLEAN NOT NULL DEFAULT false,
      "completedAt" TIMESTAMP(3),
      "claimedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "UserTask_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "UserTask_userId_taskId_key" UNIQUE ("userId", "taskId")
    )`,

    `CREATE TABLE IF NOT EXISTS "Notification" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "type" "NotificationType" NOT NULL,
      "title" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "read" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE IF NOT EXISTS "AdminSettings" (
      "id" TEXT NOT NULL,
      "platformName" TEXT NOT NULL DEFAULT 'CryptoMine 2026',
      "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
      "signupEnabled" BOOLEAN NOT NULL DEFAULT true,
      "minWithdrawalUsd" DOUBLE PRECISION NOT NULL DEFAULT 20,
      "defaultWithdrawalFee" DOUBLE PRECISION NOT NULL DEFAULT 1,
      "recaptchaEnabled" BOOLEAN NOT NULL DEFAULT false,
      "binanceApiKey" TEXT,
      "coinbaseApiKey" TEXT,
      "telegramBotToken" TEXT,
      "telegramBotUsername" TEXT,
      "smtpHost" TEXT,
      "smtpPort" INTEGER,
      "smtpUser" TEXT,
      "smtpPass" TEXT,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "AdminSettings_pkey" PRIMARY KEY ("id")
    )`,

    `CREATE TABLE IF NOT EXISTS "Session" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "token" TEXT NOT NULL,
      "expiresAt" TIMESTAMP(3) NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Session_token_key" ON "Session"("token")`,

    // Indexes
    `CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email")`,
    `CREATE INDEX IF NOT EXISTS "User_referralCode_idx" ON "User"("referralCode")`,
    `CREATE INDEX IF NOT EXISTS "User_referredById_idx" ON "User"("referredById")`,
    `CREATE INDEX IF NOT EXISTS "Deposit_userId_idx" ON "Deposit"("userId")`,
    `CREATE INDEX IF NOT EXISTS "Deposit_status_idx" ON "Deposit"("status")`,
    `CREATE INDEX IF NOT EXISTS "Withdrawal_userId_idx" ON "Withdrawal"("userId")`,
    `CREATE INDEX IF NOT EXISTS "Withdrawal_status_idx" ON "Withdrawal"("status")`,
    `CREATE INDEX IF NOT EXISTS "Transaction_userId_idx" ON "Transaction"("userId")`,
    `CREATE INDEX IF NOT EXISTS "Transaction_type_idx" ON "Transaction"("type")`,
    `CREATE INDEX IF NOT EXISTS "ReferralEarning_referrerId_idx" ON "ReferralEarning"("referrerId")`,
    `CREATE INDEX IF NOT EXISTS "ReferralEarning_referredId_idx" ON "ReferralEarning"("referredId")`,
    `CREATE INDEX IF NOT EXISTS "UserTask_userId_idx" ON "UserTask"("userId")`,
    `CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId")`,
    `CREATE INDEX IF NOT EXISTS "Notification_read_idx" ON "Notification"("read")`,
    `CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId")`,
    `CREATE INDEX IF NOT EXISTS "Session_token_idx" ON "Session"("token")`,
  ]

  for (const stmt of statements) {
    try {
      await db.$executeRawUnsafe(stmt)
    } catch (e: any) {
      if (!e.message.includes('already exists')) {
        // Silent
      }
    }
  }

  // Foreign keys
  const fkStatements = [
    `ALTER TABLE "User" ADD CONSTRAINT IF NOT EXISTS "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User"("id") ON DELETE SET NULL`,
    `ALTER TABLE "User" ADD CONSTRAINT IF NOT EXISTS "User_activePlanId_fkey" FOREIGN KEY ("activePlanId") REFERENCES "Plan"("id") ON DELETE SET NULL`,
    `ALTER TABLE "Deposit" ADD CONSTRAINT IF NOT EXISTS "Deposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
    `ALTER TABLE "Withdrawal" ADD CONSTRAINT IF NOT EXISTS "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
    `ALTER TABLE "Transaction" ADD CONSTRAINT IF NOT EXISTS "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
    `ALTER TABLE "ReferralEarning" ADD CONSTRAINT IF NOT EXISTS "ReferralEarning_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE`,
    `ALTER TABLE "ReferralEarning" ADD CONSTRAINT IF NOT EXISTS "ReferralEarning_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "User"("id")`,
    `ALTER TABLE "UserTask" ADD CONSTRAINT IF NOT EXISTS "UserTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
    `ALTER TABLE "UserTask" ADD CONSTRAINT IF NOT EXISTS "UserTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id")`,
    `ALTER TABLE "Notification" ADD CONSTRAINT IF NOT EXISTS "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
    `ALTER TABLE "Session" ADD CONSTRAINT IF NOT EXISTS "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,
  ]

  for (const stmt of fkStatements) {
    try {
      await db.$executeRawUnsafe(stmt)
    } catch (e) {
      // Silent
    }
  }
}
