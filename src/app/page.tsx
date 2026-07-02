'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { AuthModal } from '@/components/auth/auth-modal'

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

export default function Home() {
  const { lang, user, view, sidebarOpen } = useAppStore()

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  // Determine if we're in the app (authenticated) view
  const isAppView = user && view !== 'home' && view !== 'news' && view !== 'faq' && view !== 'terms' && view !== 'privacy'
  const isAdminView = view === 'admin'
  const isStandalonePage = view === 'news' || view === 'faq' || view === 'terms' || view === 'privacy'

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <AuthModal />

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
              {view === 'news' && <NewsPage />}
              {view === 'faq' && <FaqPage />}
              {view === 'terms' && <LegalPage type="terms" />}
              {view === 'privacy' && <LegalPage type="privacy" />}
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
              <Hero />
              <Plans />
              <Features />
              <HowItWorks />
              <Testimonials />
              <FAQ />
              <CTA />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
