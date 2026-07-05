import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth'

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
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    
    // Remove sensitive fields if not provided
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
        data[field] = body[field]
      }
    }

    const settings = await db.adminSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data },
    })

    return apiSuccess({ settings })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
