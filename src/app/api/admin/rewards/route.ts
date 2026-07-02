import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth'

// Get all rewards (admin view)
export async function GET() {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const rewards = await db.reward.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      take: 100,
    })

    return apiSuccess({ rewards })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Create new reward for user
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { userId, title, titleAr, description, descriptionAr, amount, currency, type, icon, expiresAt } = body

    if (!userId || !title || !amount) {
      return apiError('User ID, title, and amount are required', 400)
    }

    const reward = await db.reward.create({
      data: {
        userId,
        title,
        titleAr: titleAr || title,
        description: description || '',
        descriptionAr: descriptionAr || description || '',
        amount: parseFloat(amount),
        currency: currency || 'USDT',
        type: type || 'GIFT',
        icon: icon || '🎁',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    })

    // Create notification for user
    await db.notification.create({
      data: {
        userId,
        type: 'SUCCESS',
        title: '🎁 You received a reward!',
        message: `${title}: ${amount} ${currency || 'USDT'}. Check your rewards to claim it!`,
      }
    })

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: 'CREATE_REWARD',
        target: userId,
        details: `Created reward: ${title} (${amount} ${currency})`,
      }
    })

    return apiSuccess({ reward }, 201)
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Delete reward
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return apiError('Reward ID required', 400)

    await db.reward.delete({ where: { id } })

    return apiSuccess({ message: 'Reward deleted' })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
