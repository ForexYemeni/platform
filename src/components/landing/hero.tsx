'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, Shield, Zap, TrendingUp, Play } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

export function Hero() {
  const { lang, setAuthStage, setView } = useAppStore()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    fetch('/api/landing')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.content) setContent(d.data.content)
      })
      .catch(() => {})
  }, [])

  // Get text based on language
  const getText = (en: string, ar: string) => lang === 'ar' ? ar : en

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-radial-glow"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Floating orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#00d4ff]/20 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-[#9d4edd]/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-[#ffd700]/10 blur-3xl animate-float" style={{ animationDelay: '4s' }} />

      {/* Orbiting coins */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="relative w-[600px] h-[600px]"
        >
          {['₿', 'Ξ', '₮', '⬡', 'Ł', '◎'].map((sym, i) => (
            <div
              key={i}
              className="absolute w-12 h-12 rounded-full glass flex items-center justify-center text-xl font-bold text-gradient-electric"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 60}deg) translateX(280px) rotate(-${i * 60}deg)`,
              }}
            >
              {sym}
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-4 lg:px-8 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-[#00d4ff]/30 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-foreground/80">
              {content ? getText(content.heroBadge, content.heroBadgeAr) : (lang === 'ar' ? 'منصة الاستثمار رقم 1 لعام 2026' : 'The #1 Investment Platform of 2026')}
            </span>
            <span className="text-[#ffd700] text-xs">⭐ 4.9/5</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6"
          >
            <span className="block text-foreground">
              {content ? getText(content.heroTitle1, content.heroTitle1Ar) : (lang === 'ar' ? 'مستقبل التعدين' : 'The Future of')}
            </span>
            <span className="block text-gradient-electric animate-gradient">
              {content ? getText(content.heroTitle2, content.heroTitle2Ar) : (lang === 'ar' ? 'العملات الرقمية' : 'Crypto Mining')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {content
              ? getText(content.heroSubtitle, content.heroSubtitleAr)
              : (lang === 'ar'
                ? 'منصة استثمار فاخرة تجمع بين تقنيات التعدين المتقدمة وأمان مؤسسي. ابدأ رحلتك نحو الحرية المالية اليوم مع عوائد يومية تصل إلى 5%.'
                : 'A luxury investment platform combining advanced mining technology with institutional-grade security. Start your journey to financial freedom today with daily returns up to 5%.')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              onClick={() => setAuthStage('register')}
              className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] hover:from-[#00d4ff]/90 hover:to-[#9d4edd]/90 text-white border-0 px-8 h-14 text-base glow-electric group"
            >
              {lang === 'ar' ? 'ابدأ الاستثمار الآن' : 'Start Investing Now'}
              <ArrowRight className="h-5 w-5 ms-2 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setView('plans')
                document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 h-14 text-base glass border-white/10 hover:border-[#00d4ff]/50"
            >
              <Play className="h-4 w-4 me-2" />
              {lang === 'ar' ? 'اكتشف الخطط' : 'Explore Plans'}
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'تشفير AES-256' : 'AES-256 Encrypted'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#ffd700]" />
              <span>{lang === 'ar' ? 'سحب فوري' : 'Instant Withdrawals'}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#00d4ff]" />
              <span>{lang === 'ar' ? 'أرباح يومية' : 'Daily Returns'}</span>
            </div>
          </motion.div>

          {/* Stats bar - from admin settings */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
          >
            {[
              { label: lang === 'ar' ? 'مستثمر نشط' : 'Active Investors', value: content?.statInvestors || '250,000+', color: 'text-[#00d4ff]' },
              { label: lang === 'ar' ? 'حجم التداول' : 'Trading Volume', value: content?.statVolume || '$48M+', color: 'text-[#ffd700]' },
              { label: lang === 'ar' ? 'دولة' : 'Countries', value: content?.statCountries || '120+', color: 'text-[#9d4edd]' },
              { label: lang === 'ar' ? 'وقت التشغيل' : 'Uptime', value: content?.statUptime || '99.98%', color: 'text-emerald-400' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-center">
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
