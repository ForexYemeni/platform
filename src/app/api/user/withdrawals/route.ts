import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    const withdrawals = await db.withdrawal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return apiSuccess({ withdrawals })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { amount, currency, network, address } = body

    if (!amount || !currency || !address) {
      return apiError('Missing required fields', 400)
    }

    const amt = parseFloat(amount)
    if (amt <= 0) return apiError('Invalid amount', 400)
    if (amt > user.balance) return apiError('Insufficient balance', 400)

    // Calculate fee (1% default)
    const fee = amt * 0.01

    // Create withdrawal request
    const withdrawal = await db.withdrawal.create({
      data: {
        userId: user.id,
        amount: amt,
        currency,
        network: network || currency,
        address,
        fee,
        status: 'PENDING',
      }
    })

    // Deduct from balance immediately (will be refunded if rejected)
    await db.user.update({
      where: { id: user.id },
      data: { balance: { decrement: amt } }
    })

    // Create transaction record
    await db.transaction.create({
      data: {
        userId: user.id,
        type: 'WITHDRAWAL',
        amount: amt,
        currency,
        status: 'PENDING',
        description: `Withdrawal to ${address.substring(0, 10)}...`,
      }
    })

    await db.notification.create({
      data: {
        userId: user.id,
        type: 'INFO',
        title: 'Withdrawal Request Submitted',
        message: `Your withdrawal of ${amt} ${currency} is pending review.`,
      }
    })

    return apiSuccess({ withdrawal }, 201)
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
