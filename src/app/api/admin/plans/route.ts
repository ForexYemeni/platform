import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth'

// Get all plans (admin sees all including inactive)
export async function GET() {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const plans = await db.plan.findMany({
      orderBy: { investment: 'asc' },
    })

    return apiSuccess({ plans })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Create new plan
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const {
      name, nameAr, investment, dailyProfit, duration,
      hashrate, color, gradient, icon, popular, active, features
    } = body

    if (!name || !investment || !dailyProfit || !duration) {
      return apiError('Name, investment, dailyProfit, and duration are required', 400)
    }

    const plan = await db.plan.create({
      data: {
        name,
        nameAr: nameAr || name,
        investment: parseFloat(investment),
        dailyProfit: parseFloat(dailyProfit),
        duration: parseInt(duration),
        hashrate: hashrate || '1.0 TH/s',
        color: color || '#00d4ff',
        gradient: gradient || 'from-[#00d4ff] to-[#9d4edd]',
        icon: icon || 'default',
        popular: popular || false,
        active: active !== false,
        features: features || [],
      }
    })

    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: 'CREATE_PLAN',
        target: plan.id,
        details: `Created ${plan.name} plan`,
      }
    })

    return apiSuccess({ plan }, 201)
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Update plan
export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { id, ...updates } = body

    if (!id) return apiError('Plan ID required', 400)

    const data: any = {}
    for (const key of ['name', 'nameAr', 'hashrate', 'color', 'gradient', 'icon', 'features']) {
      if (updates[key] !== undefined) data[key] = updates[key]
    }
    for (const key of ['investment', 'dailyProfit']) {
      if (updates[key] !== undefined) data[key] = parseFloat(updates[key])
    }
    if (updates.duration !== undefined) data.duration = parseInt(updates.duration)
    for (const key of ['popular', 'active']) {
      if (updates[key] !== undefined) data[key] = updates[key]
    }

    const plan = await db.plan.update({ where: { id }, data })

    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE_PLAN',
        target: plan.id,
        details: `Updated ${plan.name} plan`,
      }
    })

    return apiSuccess({ plan })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Delete plan
export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return apiError('Plan ID required', 400)

    const plan = await db.plan.delete({ where: { id } })

    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: 'DELETE_PLAN',
        target: id,
        details: `Deleted ${plan.name} plan`,
      }
    })

    return apiSuccess({ message: 'Plan deleted' })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
