import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

// 24 hours in milliseconds
const COOLDOWN_MS = 24 * 60 * 60 * 1000

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

    // Add computed fields for cooldown logic
    const now = Date.now()
    const tasksWithStatus = tasks.map((task: any) => {
      const userTask = task.userTasks?.[0]
      let status = 'available' // available, completed, claimed, cooldown
      let cooldownEndsAt = null
      let canRetry = true

      if (userTask) {
        if (userTask.claimed && userTask.claimedAt) {
          // Check if 24 hours have passed since claim
          const claimedTime = new Date(userTask.claimedAt).getTime()
          const elapsed = now - claimedTime
          if (elapsed >= COOLDOWN_MS) {
            // Cooldown passed - can do task again
            status = 'available'
            canRetry = true
          } else {
            // Still in cooldown
            status = 'cooldown'
            cooldownEndsAt = claimedTime + COOLDOWN_MS
            canRetry = false
          }
        } else if (userTask.completed) {
          status = 'completed'
          canRetry = false
        }
      }

      return {
        ...task,
        userTask: userTask || null,
        status,
        cooldownEndsAt,
        canRetry,
        // Override completed/claimed based on cooldown
        completed: status === 'completed',
        claimed: status === 'cooldown',
      }
    })

    return apiSuccess({ tasks: tasksWithStatus })
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
    const { taskId, action } = body

    const task = await db.task.findUnique({ where: { id: taskId } })
    if (!task) return apiError('Task not found', 404)
    if (!task.active) return apiError('Task is not active', 400)

    // Find or create userTask
    let userTask = await db.userTask.findUnique({
      where: { userId_taskId: { userId: user.id, taskId } }
    })

    // Check cooldown for daily tasks
    if (userTask && userTask.claimed && userTask.claimedAt) {
      const claimedTime = new Date(userTask.claimedAt).getTime()
      const elapsed = Date.now() - claimedTime

      if (task.type === 'DAILY' && elapsed < COOLDOWN_MS) {
        const remaining = COOLDOWN_MS - elapsed
        const hoursLeft = Math.floor(remaining / (60 * 60 * 1000))
        const minutesLeft = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
        return apiError(
          `Task on cooldown. Available in ${hoursLeft}h ${minutesLeft}m`,
          400
        )
      }

      // Cooldown passed - reset task for new completion
      if (elapsed >= COOLDOWN_MS) {
        userTask = await db.userTask.update({
          where: { id: userTask.id },
          data: {
            completed: false,
            claimed: false,
            completedAt: null,
            claimedAt: null,
            progress: 0,
          }
        })
      }
    }

    if (!userTask) {
      userTask = await db.userTask.create({
        data: { userId: user.id, taskId }
      })
    }

    if (action === 'complete') {
      if (userTask.completed) return apiError('Task already completed. Claim your reward!', 400)

      userTask = await db.userTask.update({
        where: { id: userTask.id },
        data: { completed: true, completedAt: new Date() }
      })

      return apiSuccess({ userTask })
    }

    if (action === 'claim') {
      if (!userTask.completed) return apiError('Complete the task first', 400)
      if (userTask.claimed) return apiError('Reward already claimed. Wait 24h to retry.', 400)

      // Grant reward
      if (task.rewardType === 'USDT') {
        await db.user.update({
          where: { id: user.id },
          data: {
            balance: { increment: task.reward },
            totalProfit: { increment: task.reward },
          }
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

      // Create notification
      await db.notification.create({
        data: {
          userId: user.id,
          type: 'SUCCESS',
          title: 'Task Reward Claimed!',
          message: `You earned ${task.reward} ${task.rewardType} for completing: ${task.title}`,
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
