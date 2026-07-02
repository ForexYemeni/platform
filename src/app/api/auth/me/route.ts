import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return apiError('Not authenticated', 401)
    }

    return apiSuccess({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        country: user.country,
        balance: user.balance,
        totalProfit: user.totalProfit,
        dailyProfit: user.dailyProfit,
        monthlyProfit: user.monthlyProfit,
        points: user.points,
        vipLevel: user.vipLevel,
        isAdmin: user.isAdmin,
        referralCode: user.referralCode,
        twoFactorEnabled: user.twoFactorEnabled,
        emailVerified: user.emailVerified,
        activePlan: user.activePlan,
        planExpiresAt: user.planExpiresAt,
        joinedAt: user.createdAt,
      }
    })
  } catch (error: any) {
    return apiError(error.message, 500)
  }
}
