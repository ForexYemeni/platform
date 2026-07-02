'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Lang } from './i18n'

export type View =
  | 'home'
  | 'dashboard'
  | 'mining'
  | 'deposits'
  | 'withdrawals'
  | 'referral'
  | 'tasks'
  | 'notifications'
  | 'settings'
  | 'admin'
  | 'plans'
  | 'faq'
  | 'news'
  | 'about'
  | 'terms'
  | 'privacy'

export type AuthStage =
  | 'closed'
  | 'login'
  | 'register'
  | 'forgot'
  | 'otp'
  | 'twofa'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  balance: number
  totalProfit: number
  dailyProfit: number
  monthlyProfit: number
  referrals: number
  activePlan: any | null
  planExpiresAt?: string | null
  joinedAt: string
  isAdmin: boolean
  vipLevel: number
  points: number
  referralCode?: string
}

interface NotificationItem {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  time: string
  read: boolean
}

interface AppState {
  // Language & theme
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void

  // Auth
  user: User | null
  authStage: AuthStage
  setAuthStage: (stage: AuthStage) => void
  login: (user: User) => void
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<void>

  // Navigation
  view: View
  setView: (view: View) => void

  // Notifications
  notifications: NotificationItem[]
  addNotification: (n: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void
  markAllRead: () => Promise<void>

  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void

  // Loading
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Language
      lang: 'ar',
      setLang: (lang) => set({ lang }),
      toggleLang: () => set((s) => ({ lang: s.lang === 'ar' ? 'en' : 'ar' })),

      // Auth
      user: null,
      authStage: 'closed',
      setAuthStage: (authStage) => set({ authStage }),
      login: (user) => set({ user, authStage: 'closed', view: 'dashboard' }),
      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' })
        } catch {}
        set({ user: null, view: 'home', authStage: 'closed' })
      },
      fetchCurrentUser: async () => {
        try {
          const res = await fetch('/api/auth/me')
          if (!res.ok) {
            set({ user: null })
            return
          }
          const data = await res.json()
          if (data.success && data.data.user) {
            set({ user: data.data.user })
          }
        } catch {
          // Network error - keep current state
        }
      },

      // Navigation
      view: 'home',
      setView: (view) => {
        set({ view })
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      },

      // Notifications
      notifications: [
        {
          id: '1',
          type: 'success',
          title: 'مرحباً بك في المنصة',
          message: 'استكشف جميع المميزات المتاحة لك',
          time: 'الآن',
          read: false,
        },
      ],
      addNotification: (n) =>
        set((s) => ({
          notifications: [
            {
              ...n,
              id: Date.now().toString(),
              time: 'الآن',
              read: false,
            },
            ...s.notifications,
          ],
        })),
      markAllRead: async () => {
        try {
          await fetch('/api/user/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'markAllRead' })
          })
        } catch {}
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        }))
      },

      // UI
      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      mobileMenuOpen: false,
      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),

      // Loading
      loading: false,
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'cmip-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (undefined as never))),
      partialize: (state) => ({ lang: state.lang, user: state.user }),
    }
  )
)
