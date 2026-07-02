import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return apiError('Not authenticated', 401)
    }

    if (!db) {
      return apiError('Database not configured', 500)
    }

    // Get referral count
    const referralCount = await db.user.count({
      where: { referredById: user.id }
    })

    // Get recent transactions (last 10)
    const recentTransactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Get pending deposits
    const pendingDeposits = await db.deposit.count({
      where: { userId: user.id, status: 'PENDING' }
    })

    // Get pending withdrawals
    const pendingWithdrawals = await db.withdrawal.count({
      where: { userId: user.id, status: 'PENDING' }
    })

    // Get completed tasks count
    const completedTasks = await db.userTask.count({
      where: { userId: user.id, completed: true }
    })

    // Get unread notifications
    const unreadNotifications = await db.notification.count({
      where: { userId: user.id, read: false }
    })

    // Get notifications
    const notifications = await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Calculate mining status
    const isMiningActive = user.activePlanId && user.planExpiresAt && user.planExpiresAt > new Date()

    return apiSuccess({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        totalProfit: user.totalProfit,
        dailyProfit: user.dailyProfit,
        monthlyProfit: user.monthlyProfit,
        points: user.points,
        vipLevel: user.vipLevel,
        referrals: referralCount,
        activePlan: user.activePlan,
        planActivatedAt: user.planActivatedAt,
        planExpiresAt: user.planExpiresAt,
        isMiningActive,
      },
      stats: {
        completedTasks,
        pendingDeposits,
        pendingWithdrawals,
        unreadNotifications,
      },
      recentTransactions,
      notifications,
    })
  } catch (error: any) {
    console.error('Dashboard error:', error)
    return apiError(error.message, 500)
  }
}
