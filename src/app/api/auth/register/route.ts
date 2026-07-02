import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, signToken, setSessionCookie, generateReferralCode, apiSuccess, apiError } from '@/lib/auth'
import { ensureDatabaseReady } from '@/lib/auto-migrate'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, referralCode } = body

    // Validation
    if (!email || !password) {
      return apiError('Email and password are required', 400)
    }
    if (password.length < 6) {
      return apiError('Password must be at least 6 characters', 400)
    }

    if (!db) {
      return apiError('Database not configured', 500)
    }

    // 🔧 AUTO-MIGRATE: create tables + seed admin if needed
    await ensureDatabaseReady()

    // Check if user already exists
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return apiError('Email already registered', 409)
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Generate unique referral code
    let refCode = generateReferralCode(name)
    let codeExists = await db.user.findUnique({ where: { referralCode: refCode } })
    while (codeExists) {
      refCode = generateReferralCode(name)
      codeExists = await db.user.findUnique({ where: { referralCode: refCode } })
    }

    // Find referrer (if any)
    let referredById: string | null = null
    if (referralCode) {
      const referrer = await db.user.findUnique({ where: { referralCode } })
      if (referrer) {
        referredById = referrer.id
      }
    }

    // Create user - NO welcome bonus, NO fake data
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        referralCode: refCode,
        referredById,
        balance: 0, // User starts with 0 balance - must deposit real money
        totalProfit: 0,
        dailyProfit: 0,
        monthlyProfit: 0,
        points: 0,
        vipLevel: 1,
        lastLogin: new Date(),
      }
    })

    // If referred, create notification for referrer only (no fake bonus)
    if (referredById) {
      await db.notification.create({
        data: {
          userId: referredById,
          type: 'SUCCESS',
          title: 'New Referral!',
          message: `${name || 'A new user'} joined using your referral link`,
        }
      })
    }

    // Generate JWT
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
    })

    await setSessionCookie(token)

    return apiSuccess({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        referralCode: user.referralCode,
      }
    }, 201)
  } catch (error: any) {
    console.error('Register error:', error)
    return apiError('Registration failed: ' + error.message, 500)
  }
}
