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

    // Build the wallet key to search for (e.g., "USDT-TRC20")
    const walletKey = `${currency}-${network}`

    // Find a REAL wallet address from admin-managed wallets
    let address = ''
    const wallets = await db.walletAddress.findMany({
      where: {
        active: true,
        OR: [
          { currency: walletKey },
          { currency: currency, network: network },
        ]
      }
    })

    if (wallets.length > 0) {
      address = wallets[0].address
    } else {
      // No real address configured - return error
      return apiError(`No deposit address configured for ${walletKey}. Please contact support.`, 400)
    }

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
        message: `Send ${amount} ${currency} (${network}) to the address. Auto-confirms after 3 blocks.`,
      }
    })

    return apiSuccess({ deposit }, 201)
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
