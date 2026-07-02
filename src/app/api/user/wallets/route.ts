import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

// Get real wallet addresses (only active ones, for users)
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return apiError('Unauthorized', 401)
    if (!db) return apiError('Database not configured', 500)

    const wallets = await db.walletAddress.findMany({
      where: { active: true },
      orderBy: { currency: 'asc' },
    })

    // Group by currency
    const grouped: Record<string, any[]> = {}
    for (const w of wallets) {
      if (!grouped[w.currency]) grouped[w.currency] = []
      grouped[w.currency].push(w)
    }

    return apiSuccess({ wallets: grouped })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
