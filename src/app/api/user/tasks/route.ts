import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    const tasks = await db.task.findMany({
      where: { active: true },
      include: {
        userTasks: {
          where: { userId: user.id }
        }
      },
      orderBy: { createdAt: 'asc' },
    })

    return apiSuccess({ tasks })
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
    const { taskId, action } = body // action: 'complete' | 'claim'

    const task = await db.task.findUnique({ where: { id: taskId } })
    if (!task) return apiError('Task not found', 404)

    // Find or create userTask
    let userTask = await db.userTask.findUnique({
      where: { userId_taskId: { userId: user.id, taskId } }
    })

    if (!userTask) {
      userTask = await db.userTask.create({
        data: { userId: user.id, taskId }
      })
    }

    if (action === 'complete') {
      if (userTask.completed) return apiError('Task already completed', 400)
      
      userTask = await db.userTask.update({
        where: { id: userTask.id },
        data: { completed: true, completedAt: new Date() }
      })

      return apiSuccess({ userTask })
    }

    if (action === 'claim') {
      if (!userTask.completed) return apiError('Complete the task first', 400)
      if (userTask.claimed) return apiError('Reward already claimed', 400)

      // Grant reward
      if (task.rewardType === 'USDT') {
        await db.user.update({
          where: { id: user.id },
          data: { balance: { increment: task.reward } }
        })
      } else {
        await db.user.update({
          where: { id: user.id },
          data: { points: { increment: task.reward } }
        })
      }

      // Create transaction record
      await db.transaction.create({
        data: {
          userId: user.id,
          type: 'TASK_REWARD',
          amount: task.reward,
          currency: task.rewardType === 'USDT' ? 'USDT' : 'POINTS',
          description: `Task: ${task.title}`,
        }
      })

      userTask = await db.userTask.update({
        where: { id: userTask.id },
        data: { claimed: true, claimedAt: new Date() }
      })

      return apiSuccess({ userTask, reward: task.reward, type: task.rewardType })
    }

    return apiError('Invalid action', 400)
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
