import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    const notifications = await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return apiSuccess({ notifications })
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
    const { action } = body // 'markAllRead' | 'delete' | 'markRead'

    if (action === 'markAllRead') {
      await db.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true }
      })
      return apiSuccess({ message: 'All marked as read' })
    }

    if (action === 'markRead' && body.id) {
      await db.notification.update({
        where: { id: body.id, userId: user.id },
        data: { read: true }
      })
      return apiSuccess({ message: 'Marked as read' })
    }

    if (action === 'delete' && body.id) {
      await db.notification.delete({
        where: { id: body.id, userId: user.id }
      })
      return apiSuccess({ message: 'Deleted' })
    }

    return apiError('Invalid action', 400)
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
