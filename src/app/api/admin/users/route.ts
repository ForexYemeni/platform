import { db } from '@/lib/db'
import { requireAdmin, apiSuccess, apiError, hashPassword } from '@/lib/auth'
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

// Update user (block/unblock, edit balance, change email/password, delete)
export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { userId, action, value } = body

    if (!userId) return apiError('User ID required', 400)

    // Prevent admin from modifying themselves (avoid lockout)
    if (userId === admin.id && (action === 'block' || action === 'delete' || action === 'changePassword' || action === 'changeEmail')) {
      return apiError('Cannot modify your own admin account', 400)
    }

    if (action === 'block') {
      const user = await db.user.update({
        where: { id: userId },
        data: { isBlocked: true }
      })
      await db.adminLog.create({
        data: { adminId: admin.id, action: 'BLOCK_USER', target: userId, details: `Blocked ${user.email}` }
      })
      return apiSuccess({ user })
    }

    if (action === 'unblock') {
      const user = await db.user.update({
        where: { id: userId },
        data: { isBlocked: false }
      })
      await db.adminLog.create({
        data: { adminId: admin.id, action: 'UNBLOCK_USER', target: userId, details: `Unblocked ${user.email}` }
      })
      return apiSuccess({ user })
    }

    if (action === 'setBalance') {
      const user = await db.user.update({
        where: { id: userId },
        data: { balance: parseFloat(value) }
      })
      await db.adminLog.create({
        data: { adminId: admin.id, action: 'SET_BALANCE', target: userId, details: `Set balance to ${value} for ${user.email}` }
      })
      return apiSuccess({ user })
    }

    if (action === 'changeEmail') {
      // Check if email already exists
      const existing = await db.user.findUnique({ where: { email: value } })
      if (existing) return apiError('Email already in use', 400)

      const user = await db.user.update({
        where: { id: userId },
        data: { email: value }
      })
      await db.adminLog.create({
        data: { adminId: admin.id, action: 'CHANGE_EMAIL', target: userId, details: `Changed email to ${value}` }
      })
      return apiSuccess({ user })
    }

    if (action === 'changePassword') {
      if (!value || value.length < 6) return apiError('Password must be at least 6 characters', 400)
      const passwordHash = await hashPassword(value)
      const user = await db.user.update({
        where: { id: userId },
        data: { passwordHash }
      })
      await db.adminLog.create({
        data: { adminId: admin.id, action: 'CHANGE_PASSWORD', target: userId, details: `Changed password for ${user.email}` }
      })
      return apiSuccess({ message: 'Password updated' })
    }

    return apiError('Invalid action', 400)
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// DELETE user permanently
export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('id')

    if (!userId) return apiError('User ID required', 400)

    // Prevent self-deletion
    if (userId === admin.id) {
      return apiError('Cannot delete your own admin account', 400)
    }

    // Get user info before deletion for logging
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) return apiError('User not found', 404)

    // Prevent deleting other admins
    if (user.isAdmin) {
      return apiError('Cannot delete admin accounts', 400)
    }

    // Delete all related records first (cascade)
    await db.session.deleteMany({ where: { userId } })
    await db.notification.deleteMany({ where: { userId } })
    await db.userTask.deleteMany({ where: { userId } })
    await db.transaction.deleteMany({ where: { userId } })
    await db.deposit.deleteMany({ where: { userId } })
    await db.withdrawal.deleteMany({ where: { userId } })
    await db.reward.deleteMany({ where: { userId } })
    await db.referralEarning.deleteMany({ where: { referrerId: userId } })
    await db.referralEarning.deleteMany({ where: { referredId: userId } })

    // Clear referral reference from users they referred
    await db.user.updateMany({
      where: { referredById: userId },
      data: { referredById: null }
    })

    // Clear active plan reference
    await db.user.update({
      where: { id: userId },
      data: { activePlanId: null }
    })

    // Finally delete the user
    await db.user.delete({ where: { id: userId } })

    // Log admin action
    await db.adminLog.create({
      data: { adminId: admin.id, action: 'DELETE_USER', target: userId, details: `Permanently deleted ${user.email}` }
    })

    return apiSuccess({ message: 'User permanently deleted' })
  } catch (e: any) {
    console.error('Delete user error:', e)
    return apiError(e.message, 500)
  }
}
