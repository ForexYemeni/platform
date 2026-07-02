import { db } from '@/lib/db'
import { getCurrentUser, apiSuccess, apiError } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return apiError('Not authenticated', 401)
    }

    // Ensure activePlan is included
    const userWithPlan = user.activePlan ? user : await db!.user.findUnique({
      where: { id: user.id },
      include: { activePlan: true }
    })

    const userData = userWithPlan || user

    return apiSuccess({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        phone: userData.phone,
        country: userData.country,
        balance: userData.balance,
        totalProfit: userData.totalProfit,
        dailyProfit: userData.dailyProfit,
        monthlyProfit: userData.monthlyProfit,
        points: userData.points,
        vipLevel: userData.vipLevel,
        isAdmin: userData.isAdmin,
        referralCode: userData.referralCode,
        twoFactorEnabled: userData.twoFactorEnabled,
        emailVerified: userData.emailVerified,
        activePlan: userData.activePlan || null,
        planActivatedAt: userData.planActivatedAt ? (userData.planActivatedAt instanceof Date ? userData.planActivatedAt.toISOString() : userData.planActivatedAt) : null,
        planExpiresAt: userData.planExpiresAt ? (userData.planExpiresAt instanceof Date ? userData.planExpiresAt.toISOString() : userData.planExpiresAt) : null,
        joinedAt: userData.createdAt?.toISOString?.() || userData.createdAt,
      }
    })
  } catch (error: any) {
    console.error('ME API error:', error)
    return apiError(error.message, 500)
  }
}
