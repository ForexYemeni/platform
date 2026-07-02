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

    // MANDATORY referral code - user cannot register without one
    if (!referralCode || referralCode.trim().length === 0) {
      return apiError('Referral code is required. Use the admin referral code: ADMIN001', 400)
    }

    if (!db) {
      return apiError('Database not configured', 500)
    }

    await ensureDatabaseReady()

    // Check if user already exists
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return apiError('Email already registered', 409)
    }

    // Validate referral code - must exist in database
    const referrer = await db.user.findUnique({ where: { referralCode: referralCode.trim().toUpperCase() } })
    if (!referrer) {
      return apiError('Invalid referral code. Please check and try again.', 400)
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Generate unique referral code for new user
    let refCode = generateReferralCode(name)
    let codeExists = await db.user.findUnique({ where: { referralCode: refCode } })
    while (codeExists) {
      refCode = generateReferralCode(name)
      codeExists = await db.user.findUnique({ where: { referralCode: refCode } })
    }

    // Create user with referrer
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        referralCode: refCode,
        referredById: referrer.id,
        balance: 0,
        totalProfit: 0,
        dailyProfit: 0,
        monthlyProfit: 0,
        points: 0,
        vipLevel: 1,
        lastLogin: new Date(),
      }
    })

    // Create notification for referrer
    await db.notification.create({
      data: {
        userId: referrer.id,
        type: 'SUCCESS',
        title: '🎉 New Referral!',
        message: `${name || 'A new user'} joined using your referral code. You'll earn commissions when they invest.`,
      }
    })

    // Create welcome notification for new user
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'INFO',
        title: 'Welcome to CryptoMine!',
        message: `You were referred by ${referrer.name || referrer.email}. Start by depositing USDT to activate a mining plan.`,
      }
    })

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
        isAdmin: user.isAdmin,
      }
    }, 201)
  } catch (error: any) {
    console.error('Register error:', error)
    return apiError('Registration failed: ' + error.message, 500)
  }
}
