import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'
import { getMakkahNow, calculateMiningEndTime } from '@/lib/makkah-time'

// Get all available plans + mining settings
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    const plans = await db.plan.findMany({
      where: { active: true },
      orderBy: { investment: 'asc' },
    })

    // Get mining settings
    let settings: any = {
      miningMode: 'manual',
      miningStartTime: 0,
      miningDurationHours: 24,
      minMiningBalance: 0.01,
    }
    try {
      const s = await db.adminSettings.findUnique({ where: { id: 'singleton' } })
      if (s) settings = s
    } catch {}

    // Calculate mining status for user (using Makkah time)
    const now = getMakkahNow()
    const isMiningActive = user.miningExpiresAt && new Date(user.miningExpiresAt) > now
    const isPending = user.lastMiningActivation && new Date(user.lastMiningActivation) > now && user.miningExpiresAt && new Date(user.miningExpiresAt) > now
    const miningExpired = user.miningExpiresAt && new Date(user.miningExpiresAt) <= now && user.lastMiningActivation

    // If mining expired, calculate and move profits to accumulatedProfit
    if (miningExpired && user.activePlanId && user.lastMiningActivation) {
      await calculateAndStoreMiningProfit(user.id)
    }

    return apiSuccess({
      plans,
      settings: {
        miningMode: settings.miningMode,
        miningStartTime: settings.miningStartTime,
        miningDurationHours: settings.miningDurationHours,
        minMiningBalance: settings.minMiningBalance,
      },
      mining: {
        isMiningActive: isMiningActive && !isPending,
        isPending,
        lastActivation: user.lastMiningActivation?.toISOString() || null,
        expiresAt: user.miningExpiresAt?.toISOString() || null,
        autoRenew: user.miningAutoRenew,
        accumulatedProfit: user.accumulatedProfit || 0,
        totalMiningDays: user.totalMiningDays || 0,
        canWithdraw: (user.accumulatedProfit || 0) >= settings.minMiningBalance,
      }
    })
  } catch (e: any) {
    console.error('Mining GET error:', e)
    return apiError(e.message, 500)
  }
}

// Helper: Calculate mining profit for expired session
async function calculateAndStoreMiningProfit(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { activePlan: true }
  })
  if (!user || !user.activePlan || !user.lastMiningActivation || !user.miningExpiresAt) return

  const plan = user.activePlan
  const startTime = new Date(user.lastMiningActivation).getTime()
  const endTime = new Date(user.miningExpiresAt).getTime()
  const actualEnd = Math.min(endTime, Date.now())
  const elapsedMs = actualEnd - startTime
  const elapsedHours = elapsedMs / (1000 * 60 * 60)
  const elapsedDays = elapsedHours / 24

  // Calculate profit: dailyProfit% × investment × days
  const dailyProfitAmount = plan.investment * plan.dailyProfit / 100
  const profit = dailyProfitAmount * elapsedDays

  // Add to accumulatedProfit (withdrawable)
  await db.user.update({
    where: { id: userId },
    data: {
      accumulatedProfit: { increment: profit },
      totalMiningDays: { increment: Math.floor(elapsedDays) },
      totalProfit: { increment: profit },
      // Reset mining session
      lastMiningActivation: null,
      miningExpiresAt: null,
    }
  })

  // Create transaction record
  await db.transaction.create({
    data: {
      userId,
      type: 'PROFIT',
      amount: profit,
      currency: 'USDT',
      description: `Mining profit - ${plan.name} (${elapsedHours.toFixed(1)} hours)`,
    }
  })

  // Create notification
  await db.notification.create({
    data: {
      userId,
      type: 'SUCCESS',
      title: '⛏️ Mining Session Complete!',
      message: `You earned $${profit.toFixed(4)} from mining. Activate again to continue earning!`,
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { planId, action } = body

    // ============ ACTIVATE DAILY MINING (24h) ============
    if (action === 'activateMining') {
      if (!user.activePlanId || !user.activePlan) {
        return apiError('No active plan. Activate a plan first.', 400)
      }

      // Check if already mining (using Makkah time)
      const makkahNow = getMakkahNow()
      if (user.miningExpiresAt && new Date(user.miningExpiresAt) > makkahNow) {
        return apiError('Mining already active. Wait for it to expire.', 400)
      }

      // If previous session expired, calculate profit first
      if (user.miningExpiresAt && new Date(user.miningExpiresAt) <= makkahNow && user.lastMiningActivation) {
        await calculateAndStoreMiningProfit(user.id)
      }

      // Get settings
      let durationHours = 24
      let startHour = makkahNow.getHours()
      try {
        const s = await db.adminSettings.findUnique({ where: { id: 'singleton' } })
        if (s) {
          durationHours = s.miningDurationHours || 24
          if (s.miningStartTime >= 0 && s.miningStartTime < 24) {
            startHour = s.miningStartTime
          }
        }
      } catch {}

      // Calculate mining start and end times based on ADMIN's configured start hour
      // Start time = today at admin's configured hour
      const miningStart = new Date(makkahNow)
      miningStart.setHours(startHour, 0, 0, 0)

      // If start time is in the FUTURE today (e.g., it's 11:50 PM, start is 12:00 AM = 0:00)
      // then miningStart is actually tomorrow at 00:00
      if (miningStart.getTime() <= makkahNow.getTime()) {
        // Start time already passed today (e.g., it's 12:30 AM, start was 12:00 AM)
        // Mining started at 12:00 AM, end = 12:00 AM + 24h
        // Keep miningStart as today's start hour
      }
      // Note: if start time is in the future, miningStart stays as today's future time

      // End time = start + duration
      const miningEnd = new Date(miningStart.getTime() + durationHours * 60 * 60 * 1000)

      await db.user.update({
        where: { id: user.id },
        data: {
          lastMiningActivation: miningStart,
          miningExpiresAt: miningEnd,
        }
      })

      // Determine if mining is pending or active
      const isPending = miningStart.getTime() > makkahNow.getTime()

      await db.notification.create({
        data: {
          userId: user.id,
          type: 'SUCCESS',
          title: isPending ? '⏳ Mining Scheduled!' : '⛏️ Mining Activated!',
          message: isPending
            ? `Mining will start at ${miningStart.toLocaleString('en-US', { timeZone: 'Asia/Riyadh', hour: 'numeric', minute: '2-digit', hour12: true })} Makkah time.`
            : `Mining is now active! Earn profits for ${durationHours} hours.`,
        }
      })

      return apiSuccess({
        message: isPending ? 'Mining scheduled' : 'Mining activated',
        startTime: miningStart.toISOString(),
        endTime: miningEnd.toISOString(),
        isPending,
      })
    }

    // ============ TOGGLE AUTO-RENEW ============
    if (action === 'toggleAutoRenew') {
      const updated = await db.user.update({
        where: { id: user.id },
        data: { miningAutoRenew: !user.miningAutoRenew }
      })
      return apiSuccess({ autoRenew: updated.miningAutoRenew })
    }

    // ============ WITHDRAW MINING PROFITS ============
    if (action === 'withdrawProfits') {
      const profit = user.accumulatedProfit || 0

      // Get min balance from settings
      let minBalance = 0.01
      try {
        const s = await db.adminSettings.findUnique({ where: { id: 'singleton' } })
        if (s) minBalance = s.minMiningBalance
      } catch {}

      if (profit < minBalance) {
        return apiError(`Minimum withdrawal is $${minBalance}. Current: $${profit.toFixed(4)}`, 400)
      }

      // Move profits to balance (withdrawable)
      await db.user.update({
        where: { id: user.id },
        data: {
          balance: { increment: profit },
          accumulatedProfit: 0,
        }
      })

      await db.transaction.create({
        data: {
          userId: user.id,
          type: 'PROFIT',
          amount: profit,
          currency: 'USDT',
          description: 'Mining profits withdrawal',
        }
      })

      await db.notification.create({
        data: {
          userId: user.id,
          type: 'SUCCESS',
          title: '✅ Profits Withdrawn!',
          message: `$${profit.toFixed(4)} moved to your balance. Capital remains invested until plan ends.`,
        }
      })

      return apiSuccess({ amount: profit })
    }

    // ============ ACTIVATE PLAN ============
    if (planId) {
      const plan = await db.plan.findUnique({ where: { id: planId } })
      if (!plan) return apiError('Plan not found', 404)

      if (user.balance < plan.investment) {
        return apiError('Insufficient balance. Please deposit first.', 400)
      }

      if (user.activePlanId && user.planExpiresAt && new Date(user.planExpiresAt) > new Date()) {
        return apiError('You already have an active plan', 400)
      }

      // Deduct investment (capital stays until plan ends)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + plan.duration)

      // Get auto-renew default from settings
      let autoRenew = false
      try {
        const s = await db.adminSettings.findUnique({ where: { id: 'singleton' } })
        if (s) autoRenew = s.miningAutoRenewDefault
      } catch {}

      await db.user.update({
        where: { id: user.id },
        data: {
          balance: { decrement: plan.investment },
          activePlanId: plan.id,
          planActivatedAt: new Date(),
          planExpiresAt: expiresAt,
          dailyProfit: plan.investment * plan.dailyProfit / 100,
          miningAutoRenew: autoRenew,
          accumulatedProfit: 0,
        }
      })

      await db.transaction.create({
        data: {
          userId: user.id,
          type: 'DEPOSIT',
          amount: plan.investment,
          currency: 'USDT',
          description: `Activated ${plan.name} plan (capital locked)`,
        }
      })

      await db.notification.create({
        data: {
          userId: user.id,
          type: 'SUCCESS',
          title: '🎉 Plan Activated!',
          message: `${plan.name} plan activated. Capital: $${plan.investment} (locked until plan ends). Now activate daily mining to earn profits!`,
        }
      })

      // Process referral commissions
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
      }

      return apiSuccess({ message: 'Plan activated. Activate daily mining to start earning!' })
    }

    return apiError('Invalid action', 400)
  } catch (e: any) {
    console.error('Mining POST error:', e)
    return apiError(e.message, 500)
  }
}
