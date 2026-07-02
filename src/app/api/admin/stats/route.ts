import { db } from '@/lib/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const [
      totalUsers,
      activeUsers,
      blockedUsers,
      totalDeposits,
      totalWithdrawals,
      pendingDeposits,
      pendingWithdrawals,
      depositsSum,
      withdrawalsSum,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isBlocked: false } }),
      db.user.count({ where: { isBlocked: true } }),
      db.deposit.count(),
      db.withdrawal.count(),
      db.deposit.count({ where: { status: 'PENDING' } }),
      db.withdrawal.count({ where: { status: 'PENDING' } }),
      db.deposit.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
      db.withdrawal.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
    ])

    return apiSuccess({
      totalUsers,
      activeUsers,
      blockedUsers,
      totalDeposits,
      totalWithdrawals,
      pendingDeposits,
      pendingWithdrawals,
      totalDepositsAmount: depositsSum._sum.amount || 0,
      totalWithdrawalsAmount: withdrawalsSum._sum.amount || 0,
      netRevenue: (depositsSum._sum.amount || 0) - (withdrawalsSum._sum.amount || 0),
    })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
