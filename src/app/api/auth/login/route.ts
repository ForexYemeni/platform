import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, signToken, setSessionCookie, apiSuccess, apiError } from '@/lib/auth'
import { ensureDatabaseReady } from '@/lib/auto-migrate'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return apiError('Email and password are required', 400)
    }

    if (!db) {
      return apiError('Database not configured', 500)
    }

    // 🔧 AUTO-MIGRATE: create tables + seed admin if needed
    await ensureDatabaseReady()

    const user = await db.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      return apiError('Invalid email or password', 401)
    }

    if (user.isBlocked || user.isBanned) {
      return apiError('Account is blocked. Contact support.', 403)
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return apiError('Invalid email or password', 401)
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date(), lastActive: new Date() }
    })

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
        isAdmin: user.isAdmin,
        referralCode: user.referralCode,
        totalProfit: user.totalProfit,
        dailyProfit: user.dailyProfit,
        monthlyProfit: user.monthlyProfit,
        points: user.points,
        vipLevel: user.vipLevel,
        activePlan: null,
        joinedAt: user.createdAt.toISOString(),
        referrals: 0,
      }
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return apiError('Login failed: ' + error.message, 500)
  }
}
