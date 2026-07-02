import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    // Level 1: Direct referrals
    const level1Users = await db.user.findMany({
      where: { referredById: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        totalProfit: true,
        activePlanId: true,
        planActivatedAt: true,
        isBlocked: true,
        createdAt: true,
        lastActive: true,
      }
    })
    const level1Ids = level1Users.map(u => u.id)

    // Level 2: Referrals of referrals
    let level2Users: any[] = []
    if (level1Ids.length > 0) {
      level2Users = await db.user.findMany({
        where: { referredById: { in: level1Ids } },
        select: { id: true, name: true, email: true, activePlanId: true }
      })
    }
    const level2Ids = level2Users.map(u => u.id)

    // Level 3
    let level3Count = 0
    if (level2Ids.length > 0) {
      level3Count = await db.user.count({ where: { referredById: { in: level2Ids } } })
    }

    // Active referrals (have an active plan)
    const activeLevel1 = level1Users.filter(u => u.activePlanId).length
    const activeLevel2 = level2Users.filter((u: any) => u.activePlanId).length

    // Get earnings by level
    const allEarnings = await db.referralEarning.findMany({
      where: { referrerId: user.id },
    })

    const earningsByLevel = {
      1: allEarnings.filter(e => e.level === 1).reduce((s, e) => s + e.amount, 0),
      2: allEarnings.filter(e => e.level === 2).reduce((s, e) => s + e.amount, 0),
      3: allEarnings.filter(e => e.level === 3).reduce((s, e) => s + e.amount, 0),
    }

    // Recent commissions (last 20)
    const recentCommissions = await db.referralEarning.findMany({
      where: { referrerId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        referred: {
          select: {
            id: true,
            name: true,
            email: true,
            activePlanId: true,
          }
        }
      }
    })

    // Format commissions for frontend
    const formattedCommissions = recentCommissions.map(c => ({
      id: c.id,
      userName: c.referred?.name || c.referred?.email?.split('@')[0] || 'Unknown',
      level: c.level,
      percentage: c.percentage,
      amount: c.amount,
      source: c.source,
      isActive: !!c.referred?.activePlanId,
      createdAt: c.createdAt.toISOString(),
    }))

    return apiSuccess({
      referralCode: user.referralCode,
      referralLink: `${process.env.NEXTAUTH_URL || 'https://platform-eosin-chi.vercel.app'}/?ref=${user.referralCode}`,
      stats: {
        totalReferrals: level1Users.length + level2Users.length + level3Count,
        activeReferrals: activeLevel1 + activeLevel2,
        totalEarnings: earningsByLevel[1] + earningsByLevel[2] + earningsByLevel[3],
      },
      levels: [
        {
          level: 1,
          count: level1Users.length,
          activeCount: activeLevel1,
          percent: 10,
          earnings: earningsByLevel[1],
          users: level1Users.map(u => ({
            id: u.id,
            name: u.name || 'Unknown',
            email: u.email,
            balance: u.balance,
            totalProfit: u.totalProfit,
            hasActivePlan: !!u.activePlanId,
            isBlocked: u.isBlocked,
            joinedAt: u.createdAt.toISOString(),
            lastActive: u.lastActive?.toISOString() || null,
          })),
        },
        {
          level: 2,
          count: level2Users.length,
          activeCount: activeLevel2,
          percent: 5,
          earnings: earningsByLevel[2],
          users: level2Users.map((u: any) => ({
            id: u.id,
            name: u.name || 'Unknown',
            email: u.email,
            hasActivePlan: !!u.activePlanId,
          })),
        },
        {
          level: 3,
          count: level3Count,
          activeCount: 0,
          percent: 2,
          earnings: earningsByLevel[3],
          users: [],
        },
      ],
      recentCommissions: formattedCommissions,
    })
  } catch (e: any) {
    console.error('Referral API error:', e)
    return apiError(e.message, 500)
  }
}
