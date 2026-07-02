import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    // Get referral counts by level
    const level1 = await db.user.count({ where: { referredById: user.id } })
    
    // Level 2: referrals of referrals
    const level1Users = await db.user.findMany({
      where: { referredById: user.id },
      select: { id: true }
    })
    const level1Ids = level1Users.map(u => u.id)
    const level2 = level1Ids.length > 0 
      ? await db.user.count({ where: { referredById: { in: level1Ids } } })
      : 0

    // Level 3
    let level2Ids: string[] = []
    if (level1Ids.length > 0) {
      const level2Users = await db.user.findMany({
        where: { referredById: { in: level1Ids } },
        select: { id: true }
      })
      level2Ids = level2Users.map(u => u.id)
    }
    const level3 = level2Ids.length > 0
      ? await db.user.count({ where: { referredById: { in: level2Ids } } })
      : 0

    // Get total earnings
    const earnings = await db.referralEarning.aggregate({
      where: { referrerId: user.id },
      _sum: { amount: true },
      _groupBy: { level: true },
    })

    // Get recent commissions
    const recentCommissions = await db.referralEarning.findMany({
      where: { referrerId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { referred: { select: { name: true, email: true } } }
    })

    return apiSuccess({
      referralCode: user.referralCode,
      referralLink: `${process.env.NEXTAUTH_URL || 'https://your-app.vercel.app'}/?ref=${user.referralCode}`,
      levels: [
        { level: 1, count: level1, percent: 10, earnings: earnings.filter(e => e.level === 1).reduce((s, e) => s + e._sum.amount, 0) || 0 },
        { level: 2, count: level2, percent: 5, earnings: earnings.filter(e => e.level === 2).reduce((s, e) => s + e._sum.amount, 0) || 0 },
        { level: 3, count: level3, percent: 2, earnings: earnings.filter(e => e.level === 3).reduce((s, e) => s + e._sum.amount, 0) || 0 },
      ],
      recentCommissions,
    })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
