'use client'

import { motion } from 'framer-motion'
import { UserPlus, Wallet, Cpu, TrendingUp } from 'lucide-react'
import { useAppStore } from '@/lib/store'

const steps = [
  { icon: UserPlus, color: '#00d4ff', num: '01', tAr: 'أنشئ حسابك', tEn: 'Create Account', dAr: 'سجل في دقيقة واحدة بالبريد أو Google أو Telegram. فعّل المصادقة الثنائية لأمان إضافي.', dEn: 'Sign up in 1 minute via email, Google, or Telegram. Enable 2FA for extra security.' },
  { icon: Wallet, color: '#9d4edd', num: '02', tAr: 'أودع أموالك', tEn: 'Deposit Funds', dAr: 'اختر عملتك المفضلة (BTC, ETH, USDT, BNB, LTC) وأودع باستخدام عنوانك الفريد أو QR.', dEn: 'Choose your favorite coin (BTC, ETH, USDT, BNB, LTC) and deposit using your unique address or QR.' },
  { icon: Cpu, color: '#ffd700', num: '03', tAr: 'ابدأ التعدين', tEn: 'Start Mining', dAr: 'اختر خطتك المناسبة وسيبدأ التعدين فوراً. تابع الأرباح في الوقت الحقيقي من لوحتك.', dEn: 'Choose your plan and mining starts instantly. Track profits in real time from your dashboard.' },
  { icon: TrendingUp, color: '#10b981', num: '04', tAr: 'اسحب أرباحك', tEn: 'Withdraw Profits', dAr: 'احصل على أرباحك اليومية مع إمكانية السحب الفوري أو إعادة الاستثمار لمضاعفة العوائد.', dEn: 'Receive daily profits with instant withdrawals or reinvest to compound your returns.' },
]

export function HowItWorks() {
  const { lang } = useAppStore()

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#00d4ff]/10 blur-[100px]" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-[#00d4ff]/30 mb-4">
            <span className="text-xs font-medium text-[#00d4ff]">🚀 {lang === 'ar' ? 'كيف يعمل' : 'How It Works'}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            {lang === 'ar' ? 'ابدأ في ' : 'Start in '}
            <span className="text-gradient-electric">{lang === 'ar' ? '4 خطوات' : '4 Simple Steps'}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {lang === 'ar'
              ? 'من التسجيل إلى أول أرباحك في أقل من 5 دقائق. تجربة سلسة من البداية للنهاية.'
              : 'From signup to your first profit in under 5 minutes. A smooth experience from start to finish.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#00d4ff]/30 via-[#9d4edd]/30 to-[#ffd700]/30" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="relative glass rounded-3xl p-6 h-full hover:border-white/20 transition-all">
                {/* Number badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl glass border-2 flex items-center justify-center font-black text-lg"
                     style={{ borderColor: `${step.color}50`, color: step.color }}>
                  {step.num}
                </div>

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4 relative z-10"
                  style={{ background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`, border: `1px solid ${step.color}40` }}
                >
                  <step.icon className="h-8 w-8" style={{ color: step.color }} />
                </div>

                <h3 className="text-xl font-bold mb-2">
                  {lang === 'ar' ? step.tAr : step.tEn}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lang === 'ar' ? step.dAr : step.dEn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
