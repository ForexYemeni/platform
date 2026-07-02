import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    const deposits = await db.deposit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return apiSuccess({ deposits })
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
    const { amount, currency, network } = body

    if (!amount || !currency || !network) {
      return apiError('Missing required fields', 400)
    }

    // Generate a deposit address (mock - in production integrate real payment gateway)
    const addresses: Record<string, string> = {
      BTC: 'bc1q' + Math.random().toString(36).substring(2, 38),
      ETH: '0x' + Math.random().toString(16).substring(2, 42),
      'USDT-TRC20': 'T' + Math.random().toString(36).substring(2, 38),
      'USDT-ERC20': '0x' + Math.random().toString(16).substring(2, 42),
      BNB: 'bnb1' + Math.random().toString(36).substring(2, 38),
      LTC: 'ltc1q' + Math.random().toString(36).substring(2, 38),
    }

    const address = addresses[currency] || addresses['BTC']

    const deposit = await db.deposit.create({
      data: {
        userId: user.id,
        amount: parseFloat(amount),
        currency,
        network,
        address,
        status: 'PENDING',
      }
    })

    await db.notification.create({
      data: {
        userId: user.id,
        type: 'INFO',
        title: 'Deposit Address Generated',
        message: `Send ${amount} ${currency} to the generated address. Auto-confirms after 3 blocks.`,
      }
    })

    return apiSuccess({ deposit }, 201)
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
