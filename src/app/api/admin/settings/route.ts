import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth'
import { getMakkahNow } from '@/lib/makkah-time'

export async function GET() {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const settings = await db.adminSettings.findUnique({
      where: { id: 'singleton' }
    })

    return apiSuccess({ settings })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    
    const allowedFields = [
      'platformName', 'maintenanceMode', 'signupEnabled',
      'minWithdrawalUsd', 'defaultWithdrawalFee', 'recaptchaEnabled',
      'binanceApiKey', 'coinbaseApiKey',
      'telegramBotToken', 'telegramBotUsername',
      'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass',
      // Mining control fields
      'miningMode', 'miningStartTime', 'miningDurationHours',
      'miningAutoRenewDefault', 'minMiningBalance',
    ]

    const data: any = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Convert numeric fields
        if (['miningStartTime', 'miningDurationHours', 'smtpPort'].includes(field)) {
          data[field] = parseInt(body[field])
        } else if (['minMiningBalance', 'minWithdrawalUsd', 'defaultWithdrawalFee'].includes(field)) {
          data[field] = parseFloat(body[field])
        } else {
          data[field] = body[field]
        }
      }
    }

    const settings = await db.adminSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data },
    })

    // If mining settings changed, update all active mining sessions
    const miningChanged = ['miningStartTime', 'miningDurationHours', 'miningMode'].some(f => f in data)
    if (miningChanged) {
      await updateAllMiningSessions(settings)
    }

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE_SETTINGS',
        details: `Updated settings: ${Object.keys(data).join(', ')}`,
      }
    })

    return apiSuccess({ settings })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Update all active mining sessions when settings change
async function updateAllMiningSessions(settings: any) {
  const now = getMakkahNow()
  const durationHours = settings.miningDurationHours || 24
  const startHour = settings.miningStartTime >= 0 && settings.miningStartTime < 24 ? settings.miningStartTime : -1

  // Get all users with active mining
  const activeMiners = await db.user.findMany({
    where: {
      miningExpiresAt: { gt: now },
      lastMiningActivation: { not: null },
    }
  })

  for (const user of activeMiners) {
    // Recalculate end time based on new duration
    // Keep the original start time, just update end time
    const startTime = new Date(user.lastMiningActivation!)
    const newEnd = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000)

    await db.user.update({
      where: { id: user.id },
      data: { miningExpiresAt: newEnd }
    })
  }

  // If mining mode is 'auto', auto-activate mining for users with active plans but no active mining
  if (settings.miningMode === 'auto') {
    const inactiveMiners = await db.user.findMany({
      where: {
        activePlanId: { not: null },
        planExpiresAt: { gt: now },
        OR: [
          { miningExpiresAt: null },
          { miningExpiresAt: { lte: now } }
        ]
      }
    })

    for (const user of inactiveMiners) {
      const start = new Date(now)
      if (startHour >= 0) {
        start.setHours(startHour, 0, 0, 0)
        if (start.getTime() < now.getTime()) {
          start.setTime(now.getTime())
        }
      }
      const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000)

      await db.user.update({
        where: { id: user.id },
        data: {
          lastMiningActivation: start,
          miningExpiresAt: end,
        }
      })
    }
  }
}
