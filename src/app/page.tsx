'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { AuthModal } from '@/components/auth/auth-modal'
import { ErrorBoundary } from '@/components/error-boundary'

// Landing components
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Plans } from '@/components/landing/plans'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Testimonials } from '@/components/landing/testimonials'
import { FAQ } from '@/components/landing/faq'
import { CTA } from '@/components/landing/cta'
import { NewsPage } from '@/components/landing/news'
import { FaqPage } from '@/components/landing/faq-page'
import { LegalPage } from '@/components/landing/legal-page'

// Dashboard components
import { DashboardSidebar, DashboardTopbar } from '@/components/dashboard/sidebar'
import { DashboardOverview } from '@/components/dashboard/overview'
import { MiningPage } from '@/components/dashboard/mining'
import { DepositsPage } from '@/components/dashboard/deposits'
import { WithdrawalsPage } from '@/components/dashboard/withdrawals'
import { ReferralPage } from '@/components/dashboard/referral'
import { TasksPage } from '@/components/dashboard/tasks'
import { NotificationsPage } from '@/components/dashboard/notifications'
import { SettingsPage } from '@/components/dashboard/settings'

// Admin
import { AdminPanel } from '@/components/admin/admin-panel'

// Simple loading screen
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#00d4ff]/20 border-t-[#00d4ff] animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export default function Home() {
  const { lang, user, view, sidebarOpen, fetchCurrentUser } = useAppStore()
  const [authChecked, setAuthChecked] = useState(false)

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  // Check auth on mount - verify session is still valid
  useEffect(() => {
    let mounted = true
    const checkAuth = async () => {
      try {
        await fetchCurrentUser()
      } catch (e) {
        // Ignore errors - user just isn't logged in
      } finally {
        if (mounted) setAuthChecked(true)
      }
    }
    checkAuth()
    return () => { mounted = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Show loading while checking auth (prevents flash of wrong content)
  if (!authChecked) {
    return <LoadingScreen />
  }

  // Determine if we're in the app (authenticated) view
  const isAppView = user && view !== 'home' && view !== 'news' && view !== 'faq' && view !== 'terms' && view !== 'privacy'
  const isAdminView = view === 'admin'
  const isStandalonePage = view === 'news' || view === 'faq' || view === 'terms' || view === 'privacy'

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <AuthModal />

      <ErrorBoundary>
        <AnimatePresence mode="wait">
          {isAppView ? (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col flex-1"
            >
              {/* Sidebar */}
              <DashboardSidebar isAdmin={isAdminView} />

              {/* Main content with sidebar offset */}
              <div
                className={`flex-1 flex flex-col transition-all duration-300 ${
                  sidebarOpen ? 'lg:ms-64' : 'lg:ms-20'
                }`}
              >
                <DashboardTopbar />
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                  <ErrorBoundary>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={view}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {view === 'dashboard' && <DashboardOverview />}
                        {view === 'mining' && <MiningPage />}
                        {view === 'deposits' && <DepositsPage />}
                        {view === 'withdrawals' && <WithdrawalsPage />}
                        {view === 'referral' && <ReferralPage />}
                        {view === 'tasks' && <TasksPage />}
                        {view === 'notifications' && <NotificationsPage />}
                        {view === 'settings' && <SettingsPage />}
                        {view === 'admin' && <AdminPanel />}
                      </motion.div>
                    </AnimatePresence>
                  </ErrorBoundary>
                </main>
              </div>
            </motion.div>
          ) : isStandalonePage ? (
            <motion.div
              key="standalone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col flex-1"
            >
              <Navbar />
              <main className="flex-1">
                <ErrorBoundary>
                  {view === 'news' && <NewsPage />}
                  {view === 'faq' && <FaqPage />}
                  {view === 'terms' && <LegalPage type="terms" />}
                  {view === 'privacy' && <LegalPage type="privacy" />}
                </ErrorBoundary>
              </main>
              <Footer />
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col flex-1"
            >
              <Navbar />
              <main className="flex-1">
                <ErrorBoundary>
                  <Hero />
                  <Plans />
                  <Features />
                  <HowItWorks />
                  <Testimonials />
                  <FAQ />
                  <CTA />
                </ErrorBoundary>
              </main>
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </ErrorBoundary>
    </div>
  )
}
