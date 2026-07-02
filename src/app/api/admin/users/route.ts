import { db } from '@/lib/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const url = new URL(req.url)
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || ''
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (status === 'active') where.isBlocked = false
    if (status === 'blocked') where.isBlocked = true

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          balance: true,
          totalProfit: true,
          vipLevel: true,
          isAdmin: true,
          isBlocked: true,
          activePlan: true,
          createdAt: true,
          lastActive: true,
        }
      }),
      db.user.count({ where })
    ])

    return apiSuccess({ users, total, page, limit })
  } catch (e: any) {
    return apiError(e.message, e.message.includes('Unauthorized') || e.message.includes('Forbidden') ? 401 : 500)
  }
}

// Update user (block/unblock, edit balance)
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { userId, action, value } = body

    if (!userId) return apiError('User ID required', 400)

    if (action === 'block') {
      const user = await db.user.update({
        where: { id: userId },
        data: { isBlocked: true }
      })
      return apiSuccess({ user })
    }

    if (action === 'unblock') {
      const user = await db.user.update({
        where: { id: userId },
        data: { isBlocked: false }
      })
      return apiSuccess({ user })
    }

    if (action === 'setBalance') {
      const user = await db.user.update({
        where: { id: userId },
        data: { balance: parseFloat(value) }
      })
      return apiSuccess({ user })
    }

    if (action === 'setAdmin') {
      const user = await db.user.update({
        where: { id: userId },
        data: { isAdmin: !!value, role: value ? 'ADMIN' : 'USER' }
      })
      return apiSuccess({ user })
    }

    return apiError('Invalid action', 400)
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
