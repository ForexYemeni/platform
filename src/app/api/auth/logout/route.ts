import { clearSessionCookie, apiSuccess } from '@/lib/auth'

export async function POST() {
  await clearSessionCookie()
  return apiSuccess({ message: 'Logged out successfully' })
}
