import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

// Get all available plans
export async function GET() {
  try {
    if (!db) return apiError('Database not configured', 500)
    
    const plans = await db.plan.findMany({
      where: { active: true },
      orderBy: { investment: 'asc' },
    })

    return apiSuccess({ plans })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Activate a plan
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { planId, action } = body

    if (action === 'reinvest') {
      // Reinvest daily profits
      const profit = user.dailyProfit
      if (profit <= 0) return apiError('No profits to reinvest', 400)
      
      await db.user.update({
        where: { id: user.id },
        data: {
          balance: { increment: profit },
          totalProfit: { increment: profit },
        }
      })

      await db.transaction.create({
        data: {
          userId: user.id,
          type: 'PROFIT',
          amount: profit,
          currency: 'USDT',
          description: 'Reinvested profits',
        }
      })

      return apiSuccess({ message: 'Profits reinvested', amount: profit })
    }

    // Activate a plan
    if (!planId) return apiError('Plan ID required', 400)

    const plan = await db.plan.findUnique({ where: { id: planId } })
    if (!plan) return apiError('Plan not found', 404)

    if (user.balance < plan.investment) {
      return apiError('Insufficient balance. Please deposit first.', 400)
    }

    // Check if user already has active plan
    if (user.activePlanId && user.planExpiresAt && user.planExpiresAt > new Date()) {
      return apiError('You already have an active plan', 400)
    }

    // Deduct investment
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + plan.duration)

    await db.user.update({
      where: { id: user.id },
      data: {
        balance: { decrement: plan.investment },
        activePlanId: plan.id,
        planActivatedAt: new Date(),
        planExpiresAt: expiresAt,
        dailyProfit: plan.investment * plan.dailyProfit / 100,
      }
    })

    await db.transaction.create({
      data: {
        userId: user.id,
        type: 'DEPOSIT',
        amount: plan.investment,
        currency: 'USDT',
        description: `Activated ${plan.name} plan`,
      }
    })

    await db.notification.create({
      data: {
        userId: user.id,
        type: 'SUCCESS',
        title: 'Plan Activated!',
        message: `${plan.name} plan is now active. Daily profit: ${plan.dailyProfit}%`,
      }
    })

    // Process referral commission (Level 1: 10%)
    if (user.referredById) {
      const commission = plan.investment * 0.10
      await db.user.update({
        where: { id: user.referredById },
        data: { balance: { increment: commission } }
      })
      await db.referralEarning.create({
        data: {
          referrerId: user.referredById,
          referredId: user.id,
          level: 1,
          percentage: 10,
          amount: commission,
          source: 'plan_activation',
        }
      })

      // Level 2: 5%
      const referrer = await db.user.findUnique({ where: { id: user.referredById } })
      if (referrer?.referredById) {
        const commission2 = plan.investment * 0.05
        await db.user.update({
          where: { id: referrer.referredById },
          data: { balance: { increment: commission2 } }
        })
        await db.referralEarning.create({
          data: {
            referrerId: referrer.referredById,
            referredId: user.id,
            level: 2,
            percentage: 5,
            amount: commission2,
            source: 'plan_activation',
          }
        })

        // Level 3: 2%
        const referrer2 = await db.user.findUnique({ where: { id: referrer.referredById } })
        if (referrer2?.referredById) {
          const commission3 = plan.investment * 0.02
          await db.user.update({
            where: { id: referrer2.referredById },
            data: { balance: { increment: commission3 } }
          })
          await db.referralEarning.create({
            data: {
              referrerId: referrer2.referredById,
              referredId: user.id,
              level: 3,
              percentage: 2,
              amount: commission3,
              source: 'plan_activation',
            }
          })
        }
      }
    }

    return apiSuccess({ message: 'Plan activated successfully', planId })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
