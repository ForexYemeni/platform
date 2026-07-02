import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth'

// Get all tasks (admin sees all)
export async function GET() {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const tasks = await db.task.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return apiSuccess({ tasks })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Create new task
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const {
      title, titleAr, description, descriptionAr,
      type, reward, rewardType, icon, total, active
    } = body

    if (!title || !type || reward === undefined || !rewardType) {
      return apiError('Title, type, reward, and rewardType are required', 400)
    }

    const validTypes = ['DAILY', 'WEEKLY', 'SPECIAL']
    if (!validTypes.includes(type)) {
      return apiError('Invalid type. Must be: DAILY, WEEKLY, or SPECIAL', 400)
    }

    const validRewardTypes = ['USDT', 'POINTS']
    if (!validRewardTypes.includes(rewardType)) {
      return apiError('Invalid rewardType. Must be: USDT or POINTS', 400)
    }

    const task = await db.task.create({
      data: {
        title,
        titleAr: titleAr || title,
        description: description || '',
        descriptionAr: descriptionAr || description || '',
        type,
        reward: parseFloat(reward),
        rewardType,
        icon: icon || '✅',
        total: total ? parseInt(total) : null,
        active: active !== false,
      }
    })

    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: 'CREATE_TASK',
        target: task.id,
        details: `Created ${task.title} task`,
      }
    })

    return apiSuccess({ task }, 201)
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Update task
export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { id, ...updates } = body

    if (!id) return apiError('Task ID required', 400)

    const data: any = {}
    for (const key of ['title', 'titleAr', 'description', 'descriptionAr', 'type', 'rewardType', 'icon']) {
      if (updates[key] !== undefined) data[key] = updates[key]
    }
    if (updates.reward !== undefined) data.reward = parseFloat(updates.reward)
    if (updates.total !== undefined) data.total = updates.total ? parseInt(updates.total) : null
    for (const key of ['active']) {
      if (updates[key] !== undefined) data[key] = updates[key]
    }

    const task = await db.task.update({ where: { id }, data })

    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE_TASK',
        target: task.id,
        details: `Updated ${task.title} task`,
      }
    })

    return apiSuccess({ task })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Delete task
export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return apiError('Task ID required', 400)

    const task = await db.task.delete({ where: { id } })

    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: 'DELETE_TASK',
        target: id,
        details: `Deleted ${task.title} task`,
      }
    })

    return apiSuccess({ message: 'Task deleted' })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
