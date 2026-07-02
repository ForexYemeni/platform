'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Cpu, ArrowDownToLine, ArrowUpFromLine,
  Users, CheckSquare, Bell, Settings, Shield, X, LogOut, Sparkles, Crown
} from 'lucide-react'
import { useAppStore, type View } from '@/lib/store'
import { Logo } from '@/components/shared/logo'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const menuItems: { icon: any; view: View; labelAr: string; labelEn: string; badge?: string }[] = [
  { icon: LayoutDashboard, view: 'dashboard', labelAr: 'نظرة عامة', labelEn: 'Overview' },
  { icon: Cpu, view: 'mining', labelAr: 'التعدين', labelEn: 'Mining' },
  { icon: ArrowDownToLine, view: 'deposits', labelAr: 'الإيداعات', labelEn: 'Deposits' },
  { icon: ArrowUpFromLine, view: 'withdrawals', labelAr: 'السحوبات', labelEn: 'Withdrawals' },
  { icon: Users, view: 'referral', labelAr: 'الإحالات', labelEn: 'Referrals' },
  { icon: CheckSquare, view: 'tasks', labelAr: 'المهام', labelEn: 'Tasks', badge: '3' },
  { icon: Bell, view: 'notifications', labelAr: 'الإشعارات', labelEn: 'Notifications', badge: '2' },
  { icon: Settings, view: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings' },
]

export function DashboardSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const { lang, view, setView, user, logout, sidebarOpen, setSidebarOpen, mobileMenuOpen, setMobileMenuOpen } = useAppStore()
  const isRtl = lang === 'ar'

  const adminItems: { icon: any; view: View; labelAr: string; labelEn: string }[] = [
    { icon: Shield, view: 'admin', labelAr: 'لوحة الإدارة', labelEn: 'Admin Panel' },
  ]

  const items = isAdmin ? adminItems : menuItems

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed top-0 bottom-0 z-40 glass border-white/5 transition-all duration-300",
          isRtl ? "right-0 border-s" : "left-0 border-e",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className={cn("p-4 flex items-center", sidebarOpen ? 'justify-between' : 'justify-center')}>
          {sidebarOpen ? <Logo /> : <Logo withText={false} size={36} />}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn("text-muted-foreground hover:text-foreground transition-colors", !sidebarOpen && 'hidden')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-luxury">
          <div className="space-y-1">
            {items.map((item) => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group",
                  view === item.view
                    ? "bg-gradient-to-r from-[#00d4ff]/20 to-[#9d4edd]/20 text-foreground border border-[#00d4ff]/30"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  !sidebarOpen && "justify-center"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", view === item.view && "text-[#00d4ff]")} />
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-medium flex-1 text-start">
                      {isRtl ? item.labelAr : item.labelEn}
                    </span>
                    {item.badge && (
                      <Badge className="bg-[#9d4edd] text-white border-0 text-[10px] px-1.5 py-0">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {!sidebarOpen && item.badge && (
                  <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-[#9d4edd]" />
                )}
              </button>
            ))}
          </div>

          {/* Admin link */}
          {!isAdmin && user?.isAdmin && (
            <div className="mt-4 pt-4 border-t border-border">
              <button
                onClick={() => setView('admin')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                  view === 'admin'
                    ? "bg-gradient-to-r from-[#ffd700]/20 to-[#ff8c00]/20 text-foreground border border-[#ffd700]/30"
                    : "text-[#ffd700] hover:bg-accent/50",
                  !sidebarOpen && "justify-center"
                )}
              >
                <Shield className="h-5 w-5" />
                {sidebarOpen && <span className="text-sm font-medium">{isRtl ? 'لوحة الإدارة' : 'Admin Panel'}</span>}
              </button>
            </div>
          )}
        </nav>

        {/* VIP status */}
        {sidebarOpen && (
          <div className="p-3">
            <div className="rounded-2xl p-4 bg-gradient-to-br from-[#ffd700]/20 to-[#ff8c00]/10 border border-[#ffd700]/30">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-[#ffd700]" />
                <span className="text-xs font-bold text-[#ffd700]">VIP {user?.vipLevel || 1}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {isRtl ? 'ترقية إلى VIP 3 للحصول على مكافآت إضافية' : 'Upgrade to VIP 3 for extra rewards'}
              </p>
              <div className="w-full h-1.5 rounded-full bg-black/30 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#ffd700] to-[#ff8c00]" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        )}

        {/* User card */}
        <div className="p-3 border-t border-border">
          <div className={cn("flex items-center gap-3 p-2 rounded-xl", !sidebarOpen && 'justify-center')}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#9d4edd] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={logout}
                className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                title={isRtl ? 'تسجيل الخروج' : 'Logout'}
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          >
            <motion.aside
              initial={{ x: isRtl ? 300 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? 300 : -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "absolute top-0 bottom-0 w-72 glass border-white/10 p-4 flex flex-col",
                isRtl ? "right-0" : "left-0"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <Logo />
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto">
                {items.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => { setView(item.view); setMobileMenuOpen(false) }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                      view === item.view
                        ? "bg-gradient-to-r from-[#00d4ff]/20 to-[#9d4edd]/20 text-foreground border border-[#00d4ff]/30"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", view === item.view && "text-[#00d4ff]")} />
                    <span className="text-sm font-medium flex-1 text-start">
                      {isRtl ? item.labelAr : item.labelEn}
                    </span>
                    {item.badge && (
                      <Badge className="bg-[#9d4edd] text-white border-0 text-[10px]">{item.badge}</Badge>
                    )}
                  </button>
                ))}

                {/* Admin link in mobile sidebar */}
                {user?.isAdmin && (
                  <button
                    onClick={() => { setView('admin'); setMobileMenuOpen(false) }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mt-2",
                      view === 'admin'
                        ? "bg-gradient-to-r from-[#ffd700]/20 to-[#ff8c00]/20 text-foreground border border-[#ffd700]/30"
                        : "text-[#ffd700] hover:bg-accent/50"
                    )}
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-sm font-medium flex-1 text-start">
                      {isRtl ? 'لوحة الإدارة' : 'Admin Panel'}
                    </span>
                  </button>
                )}
              </nav>

              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function DashboardTopbar() {
  const { lang, user, setMobileMenuOpen, notifications, setView } = useAppStore()
  const isRtl = lang === 'ar'
  const unread = notifications.filter(n => !n.read).length

  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Mobile menu */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-accent"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <input
            type="text"
            placeholder={isRtl ? 'بحث سريع...' : 'Quick search...'}
            className="w-full h-9 px-4 rounded-xl glass border-white/5 bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/30"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={() => setView('notifications')}
            className="relative w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-accent transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-[#9d4edd] text-white text-[10px] flex items-center justify-center font-bold">
                {unread}
              </span>
            )}
          </button>

          {/* Balance pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-full glass border-[#ffd700]/20 bg-[#ffd700]/5">
            <Sparkles className="h-3.5 w-3.5 text-[#ffd700]" />
            <span className="text-sm font-bold text-[#ffd700]">
              ${(user?.balance || 0).toFixed(2)}
            </span>
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#9d4edd] flex items-center justify-center text-white font-bold text-sm cursor-pointer"
               onClick={() => setView('settings')}>
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  )
}
