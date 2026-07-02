import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, apiSuccess, apiError } from '@/lib/auth'

// Get all wallet addresses
export async function GET() {
  try {
    await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const wallets = await db.walletAddress.findMany({
      orderBy: { currency: 'asc' },
    })

    return apiSuccess({ wallets })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Create new wallet address
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { currency, network, address, qrCode, label } = body

    if (!currency || !network || !address) {
      return apiError('Currency, network, and address are required', 400)
    }

    const wallet = await db.walletAddress.create({
      data: { currency, network, address, qrCode, label }
    })

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: 'CREATE_WALLET',
        target: wallet.id,
        details: `Created ${currency} (${network}) wallet address`,
      }
    })

    return apiSuccess({ wallet }, 201)
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Update wallet address
export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const body = await req.json()
    const { id, currency, network, address, qrCode, label, active } = body

    if (!id) return apiError('Wallet ID required', 400)

    const data: any = {}
    if (currency !== undefined) data.currency = currency
    if (network !== undefined) data.network = network
    if (address !== undefined) data.address = address
    if (qrCode !== undefined) data.qrCode = qrCode
    if (label !== undefined) data.label = label
    if (active !== undefined) data.active = active

    const wallet = await db.walletAddress.update({
      where: { id },
      data,
    })

    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE_WALLET',
        target: wallet.id,
        details: `Updated ${wallet.currency} wallet`,
      }
    })

    return apiSuccess({ wallet })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}

// Delete wallet address
export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!db) return apiError('Database not configured', 500)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return apiError('Wallet ID required', 400)

    const wallet = await db.walletAddress.delete({ where: { id } })

    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: 'DELETE_WALLET',
        target: id,
        details: `Deleted ${wallet.currency} wallet`,
      }
    })

    return apiSuccess({ message: 'Wallet deleted' })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
