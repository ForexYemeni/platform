import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

// Get user's rewards (unclaimed)
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    const rewards = await db.reward.findMany({
      where: {
        userId: user.id,
        claimed: false,
      },
      orderBy: { createdAt: 'desc' },
    })

    return apiSuccess({ rewards })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Claim a reward
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { rewardId } = body

    if (!rewardId) return apiError('Reward ID required', 400)

    const reward = await db.reward.findUnique({ where: { id: rewardId } })
    if (!reward) return apiError('Reward not found', 404)
    if (reward.userId !== user.id) return apiError('Not your reward', 403)
    if (reward.claimed) return apiError('Already claimed', 400)

    // Check expiry
    if (reward.expiresAt && new Date(reward.expiresAt) < new Date()) {
      return apiError('Reward expired', 400)
    }

    // Credit user balance
    await db.user.update({
      where: { id: user.id },
      data: {
        balance: { increment: reward.amount },
        totalProfit: { increment: reward.amount },
      }
    })

    // Mark as claimed
    await db.reward.update({
      where: { id: rewardId },
      data: { claimed: true, claimedAt: new Date() }
    })

    // Create transaction record
    await db.transaction.create({
      data: {
        userId: user.id,
        type: 'BONUS',
        amount: reward.amount,
        currency: reward.currency,
        description: `Reward: ${reward.title}`,
      }
    })

    // Create notification
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'SUCCESS',
        title: '🎉 Reward Claimed!',
        message: `You claimed ${reward.amount} ${reward.currency} from: ${reward.title}`,
      }
    })

    return apiSuccess({ reward, claimed: reward.amount })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
