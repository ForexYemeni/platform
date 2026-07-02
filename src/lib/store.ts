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
  avatar: string
  balance: number
  totalProfit: number
  dailyProfit: number
  monthlyProfit: number
  referrals: number
  activePlan: string | null
  joinedAt: string
  isAdmin: boolean
  vipLevel: number
  points: number
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
  logout: () => void

  // Navigation
  view: View
  setView: (view: View) => void

  // Notifications
  notifications: NotificationItem[]
  addNotification: (n: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void
  markAllRead: () => void

  // Mining stats
  miningHashrate: number
  miningUptime: number
  incrementMining: () => void

  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
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
      logout: () => set({ user: null, view: 'home', authStage: 'closed' }),

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
          title: 'تم استلام أرباحك اليومية',
          message: 'تم إضافة $4.50 إلى رصيدك من الخطة الذهبية',
          time: 'منذ 5 دقائق',
          read: false,
        },
        {
          id: '2',
          type: 'info',
          title: 'إيداع جديد مؤكد',
          message: 'تم تأكيد إيداع بقيمة 0.005 BTC',
          time: 'منذ ساعة',
          read: false,
        },
        {
          id: '3',
          type: 'warning',
          title: 'تذكير: أكمل مهامك اليومية',
          message: 'لديك 3 مهام غير مكتملة اليوم',
          time: 'منذ 3 ساعات',
          read: true,
        },
        {
          id: '4',
          type: 'success',
          title: 'إحالة جديدة',
          message: 'انضم مستخدم جديد عبر رابطك في المستوى الأول',
          time: 'منذ 5 ساعات',
          read: true,
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
      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      // Mining
      miningHashrate: 145.32,
      miningUptime: 99.98,
      incrementMining: () =>
        set((s) => ({
          miningHashrate: s.miningHashrate + Math.random() * 2 - 1,
        })),

      // UI
      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      mobileMenuOpen: false,
      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
    }),
    {
      name: 'cmip-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (undefined as never))),
      partialize: (state) => ({ lang: state.lang, user: state.user }),
    }
  )
)
