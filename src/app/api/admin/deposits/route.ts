import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const deposits = await db.deposit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return apiSuccess({ deposits })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { depositId, action } = body // action: 'approve' | 'reject'

    const deposit = await db.deposit.findUnique({
      where: { id: depositId },
      include: { user: true }
    })

    if (!deposit) return apiError('Deposit not found', 404)
    if (deposit.status !== 'PENDING') return apiError('Already processed', 400)

    if (action === 'approve') {
      await db.deposit.update({
        where: { id: depositId },
        data: { status: 'COMPLETED' }
      })

      // Credit user balance
      await db.user.update({
        where: { id: deposit.userId },
        data: { balance: { increment: deposit.amount } }
      })

      await db.transaction.create({
        data: {
          userId: deposit.userId,
          type: 'DEPOSIT',
          amount: deposit.amount,
          currency: deposit.currency,
          description: `Deposit confirmed - ${deposit.network}`,
        }
      })

      await db.notification.create({
        data: {
          userId: deposit.userId,
          type: 'SUCCESS',
          title: 'Deposit Confirmed!',
          message: `${deposit.amount} ${deposit.currency} has been credited to your balance.`,
        }
      })

      // Process referral commissions
      if (deposit.user.referredById) {
        const commission = deposit.amount * 0.10
        await db.user.update({
          where: { id: deposit.user.referredById },
          data: { balance: { increment: commission } }
        })
        await db.referralEarning.create({
          data: {
            referrerId: deposit.user.referredById,
            referredId: deposit.userId,
            level: 1,
            percentage: 10,
            amount: commission,
            source: 'deposit',
          }
        })
      }
    } else if (action === 'reject') {
      await db.deposit.update({
        where: { id: depositId },
        data: { status: 'REJECTED' }
      })

      await db.notification.create({
        data: {
          userId: deposit.userId,
          type: 'ERROR',
          title: 'Deposit Rejected',
          message: `Your deposit of ${deposit.amount} ${deposit.currency} was rejected. Please contact support.`,
        }
      })
    }

    return apiSuccess({ message: `Deposit ${action}d` })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
