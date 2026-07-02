import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth'

// Get all referral data (admin view)
export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')

    if (userId) {
      // Get specific user's referral tree
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, referralCode: true }
      })
      if (!user) return apiError('User not found', 404)

      // Level 1
      const level1 = await db.user.findMany({
        where: { referredById: userId },
        select: {
          id: true, name: true, email: true, balance: true, totalProfit: true,
          activePlanId: true, planActivatedAt: true, planExpiresAt: true,
          isBlocked: true, createdAt: true, lastActive: true,
        }
      })

      // Level 2
      const level1Ids = level1.map(u => u.id)
      const level2 = level1Ids.length > 0
        ? await db.user.findMany({
            where: { referredById: { in: level1Ids } },
            select: { id: true, name: true, email: true, activePlanId: true, createdAt: true }
          })
        : []
      const level2Ids = level2.map(u => u.id)

      // Level 3
      const level3 = level2Ids.length > 0
        ? await db.user.findMany({
            where: { referredById: { in: level2Ids } },
            select: { id: true, name: true, email: true, activePlanId: true, createdAt: true }
          })
        : []

      // Earnings
      const earnings = await db.referralEarning.findMany({
        where: { referrerId: userId },
        orderBy: { createdAt: 'desc' },
      })

      const totalEarnings = earnings.reduce((s, e) => s + e.amount, 0)

      return apiSuccess({
        user,
        tree: {
          level1: {
            count: level1.length,
            activeCount: level1.filter(u => u.activePlanId).length,
            users: level1,
          },
          level2: {
            count: level2.length,
            activeCount: level2.filter(u => u.activePlanId).length,
            users: level2,
          },
          level3: {
            count: level3.length,
            activeCount: level3.filter(u => u.activePlanId).length,
            users: level3,
          },
        },
        totalEarnings,
        recentEarnings: earnings.slice(0, 20),
      })
    }

    // Get all users with referral stats
    const users = await db.user.findMany({
      where: { isAdmin: false },
      select: {
        id: true, name: true, email: true, referralCode: true,
        balance: true, totalProfit: true, activePlanId: true,
        isBlocked: true, createdAt: true, lastActive: true,
        referredById: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // For each user, get referral counts
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const refCount = await db.user.count({ where: { referredById: u.id } })
        const activeRefCount = await db.user.count({
          where: {
            referredById: u.id,
            activePlanId: { not: null }
          }
        })
        const earnings = await db.referralEarning.aggregate({
          where: { referrerId: u.id },
          _sum: { amount: true }
        })

        // Who referred this user
        let referredBy = null
        if (u.referredById) {
          const referrer = await db.user.findUnique({
            where: { id: u.referredById },
            select: { name: true, email: true, referralCode: true }
          })
          referredBy = referrer
        }

        return {
          ...u,
          referralCount: refCount,
          activeReferralCount: activeRefCount,
          referralEarnings: earnings._sum.amount || 0,
          referredBy,
        }
      })
    )

    // Overall stats
    const totalReferrals = usersWithStats.reduce((s, u) => s + u.referralCount, 0)
    const totalActiveReferrals = usersWithStats.reduce((s, u) => s + u.activeReferralCount, 0)
    const totalEarningsAll = usersWithStats.reduce((s, u) => s + u.referralEarnings, 0)

    return apiSuccess({
      users: usersWithStats,
      stats: {
        totalUsers: users.length,
        totalReferrals,
        totalActiveReferrals,
        totalEarnings: totalEarningsAll,
      }
    })
  } catch (e: any) {
    console.error('Admin referrals API error:', e)
    return apiError(e.message, 500)
  }
}

// Update referral settings (commission percentages - stored in AdminSettings)
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { action } = body

    // Future: adjust commission percentages, etc.
    return apiSuccess({ message: 'Updated' })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
