import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const withdrawals = await db.withdrawal.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return apiSuccess({ withdrawals })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { withdrawalId, action } = body // 'approve' | 'reject'

    const withdrawal = await db.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { user: true }
    })

    if (!withdrawal) return apiError('Withdrawal not found', 404)
    if (withdrawal.status !== 'PENDING') return apiError('Already processed', 400)

    if (action === 'approve') {
      await db.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: 'COMPLETED',
          processedAt: new Date(),
        }
      })

      await db.transaction.updateMany({
        where: {
          userId: withdrawal.userId,
          type: 'WITHDRAWAL',
          status: 'PENDING',
          amount: withdrawal.amount,
        },
        data: { status: 'COMPLETED' }
      })

      await db.notification.create({
        data: {
          userId: withdrawal.userId,
          type: 'SUCCESS',
          title: 'Withdrawal Approved!',
          message: `${withdrawal.amount} ${withdrawal.currency} has been sent to your address.`,
        }
      })
    } else if (action === 'reject') {
      await db.withdrawal.update({
        where: { id: withdrawalId },
        data: { status: 'REJECTED', processedAt: new Date() }
      })

      // Refund the user
      await db.user.update({
        where: { id: withdrawal.userId },
        data: { balance: { increment: withdrawal.amount } }
      })

      await db.transaction.updateMany({
        where: {
          userId: withdrawal.userId,
          type: 'WITHDRAWAL',
          status: 'PENDING',
          amount: withdrawal.amount,
        },
        data: { status: 'REJECTED' }
      })

      await db.notification.create({
        data: {
          userId: withdrawal.userId,
          type: 'WARNING',
          title: 'Withdrawal Rejected',
          message: `Your withdrawal was rejected. Amount refunded to your balance.`,
        }
      })
    }

    return apiSuccess({ message: `Withdrawal ${action}d` })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
