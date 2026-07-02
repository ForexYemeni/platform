'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { marketData } from '@/lib/data'
import { Logo } from './logo'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navbar() {
  const { lang, setLang, user, setView, setAuthStage, setMobileMenuOpen, mobileMenuOpen } = useAppStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: lang === 'ar' ? 'الرئيسية' : 'Home', view: 'home' as const, anchor: 'home' },
    { label: lang === 'ar' ? 'الخطط' : 'Plans', view: 'home' as const, anchor: 'plans' },
    { label: lang === 'ar' ? 'المميزات' : 'Features', view: 'home' as const, anchor: 'features' },
    { label: lang === 'ar' ? 'الأخبار' : 'News', view: 'news' as const, anchor: null },
    { label: lang === 'ar' ? 'الأسئلة' : 'FAQ', view: 'faq' as const, anchor: null },
  ]

  const scrollToSection = (anchor: string) => {
    setView('home')
    setTimeout(() => {
      const el = document.getElementById(anchor)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <>
      {/* Live ticker */}
      <div className="bg-gradient-to-r from-[#0a0a14] via-[#13132a] to-[#0a0a14] border-b border-white/5 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap py-1.5">
          {[...marketData, ...marketData].map((coin, i) => (
            <div key={i} className="flex items-center gap-2 px-4 text-xs">
              <span className="font-bold text-white/90">{coin.symbol}</span>
              <span className="text-white/60">${coin.price.toLocaleString()}</span>
              <span className={coin.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {coin.change >= 0 ? '▲' : '▼'} {Math.abs(coin.change)}%
              </span>
              <span className="text-white/20">|</span>
            </div>
          ))}
        </div>
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setView('home')} className="flex-shrink-0">
              <Logo />
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.anchor ? (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.anchor)}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/50"
                  >
                    {link.label}
                  </button>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => setView(link.view)}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/50"
                  >
                    {link.label}
                  </button>
                )
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Language */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLang('ar')}>
                    🇸🇦 العربية
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLang('en')}>
                    🇬🇧 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {user ? (
                <Button
                  onClick={() => setView('dashboard')}
                  className="hidden sm:flex bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] hover:from-[#00d4ff]/90 hover:to-[#9d4edd]/90 text-white border-0"
                >
                  {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setAuthStage('login')}
                    className="hidden sm:flex"
                  >
                    {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
                  </Button>
                  <Button
                    onClick={() => setAuthStage('register')}
                    className="hidden sm:flex bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] hover:from-[#00d4ff]/90 hover:to-[#9d4edd]/90 text-white border-0 glow-electric"
                  >
                    {lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                  </Button>
                </>
              )}

              {/* Mobile menu */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden glass border-t border-border"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) =>
                  link.anchor ? (
                    <button
                      key={link.label}
                      onClick={() => {
                        scrollToSection(link.anchor)
                        setMobileMenuOpen(false)
                      }}
                      className="block w-full text-start px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <button
                      key={link.label}
                      onClick={() => {
                        setView(link.view)
                        setMobileMenuOpen(false)
                      }}
                      className="block w-full text-start px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg"
                    >
                      {link.label}
                    </button>
                  )
                )}
                <div className="pt-2 border-t border-border grid grid-cols-2 gap-2">
                  {!user && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAuthStage('login')
                          setMobileMenuOpen(false)
                        }}
                      >
                        {lang === 'ar' ? 'دخول' : 'Login'}
                      </Button>
                      <Button
                        onClick={() => {
                          setAuthStage('register')
                          setMobileMenuOpen(false)
                        }}
                        className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0"
                      >
                        {lang === 'ar' ? 'تسجيل' : 'Sign Up'}
                      </Button>
                    </>
                  )}
                  {user && (
                    <Button
                      onClick={() => {
                        setView('dashboard')
                        setMobileMenuOpen(false)
                      }}
                      className="col-span-2 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0"
                    >
                      {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
