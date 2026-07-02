import { db } from './db'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback-secret-change-me'
const SESSION_COOKIE = 'cmip_session'
const SESSION_DURATION = 30 * 24 * 60 * 60 // 30 days in seconds

export interface JWTPayload {
  userId: string
  email: string
  role: string
  isAdmin: boolean
}

// ============================================
// Hash password (using Web Crypto API - works on Vercel)
// ============================================
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + JWT_SECRET)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password)
  return computed === hash
}

// ============================================
// JWT Token management
// ============================================
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_DURATION })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

// ============================================
// Session cookie management
// ============================================
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value
}

// ============================================
// Get current user (server-side)
// ============================================
export async function getCurrentUser() {
  const token = await getSessionToken()
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  if (!db) return null

  try {
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: { activePlan: true }
    })
    return user
  } catch {
    return null
  }
}

// ============================================
// Require auth (for protected routes)
// ============================================
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (!user.isAdmin) {
    throw new Error('Forbidden - Admin only')
  }
  return user
}

// ============================================
// Generate referral code
// ============================================
export function generateReferralCode(name?: string): string {
  const prefix = name ? name.substring(0, 3).toUpperCase() : 'CM'
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}${random}`
}

// ============================================
// API response helpers
// ============================================
export function apiSuccess(data: any, status = 200) {
  return Response.json({ success: true, data }, { status })
}

export function apiError(message: string, status = 400, code?: string) {
  return Response.json({ success: false, error: message, code }, { status })
}
