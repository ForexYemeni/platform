'use client'

import { motion } from 'framer-motion'
import { Cpu, ShieldCheck, Zap, Users, BarChart3, Languages } from 'lucide-react'
import { useAppStore } from '@/lib/store'

const features = [
  { icon: Cpu, color: '#00d4ff', tAr: 'تعدين آلي 24/7', tEn: 'Automated Mining 24/7', dAr: 'مزارع تعدين متطورة تعمل على مدار الساعة بأحدث معدات ASIC و GPU لتعظيم أرباحك بلا توقف.', dEn: 'State-of-the-art mining farms running 24/7 with the latest ASIC and GPU equipment to maximize your returns non-stop.' },
  { icon: ShieldCheck, color: '#9d4edd', tAr: 'أمان مؤسسي', tEn: 'Institutional Security', dAr: 'تشفير AES-256، مصادقة ثنائية، حماية DDoS، وتخزين بارد لـ 95% من العملات الرقمية.', dEn: 'AES-256 encryption, 2FA, DDoS protection, and cold storage for 95% of cryptocurrency holdings.' },
  { icon: Zap, color: '#ffd700', tAr: 'سحب فوري', tEn: 'Instant Withdrawals', dAr: 'معالجة طلبات السحب تلقائياً خلال 5 دقائق مع دعم متعدد للعملات والشبكات بلا تأخير.', dEn: 'Withdrawal requests processed automatically within 5 minutes, with multi-currency and multi-network support.' },
  { icon: Users, color: '#10b981', tAr: 'نظام إحالات متعدد', tEn: 'Multi-Tier Referral', dAr: 'اربح عمولات من 3 مستويات: 10% للمستوى الأول، 5% للثاني، 2% للثالث، مدى الحياة.', dEn: 'Earn commissions across 3 tiers: 10% on level 1, 5% on level 2, 2% on level 3, for life.' },
  { icon: BarChart3, color: '#f43f5e', tAr: 'لوحة تحكم متقدمة', tEn: 'Advanced Dashboard', dAr: 'تحليلات مباشرة، رسوم بيانية تفاعلية، وتقارير مفصلة عن أداء استثماراتك في الزمن الحقيقي.', dEn: 'Real-time analytics, interactive charts, and detailed reports on your investment performance in real time.' },
  { icon: Languages, color: '#06b6d4', tAr: 'دعم متعدد اللغات', tEn: 'Multi-Language Support', dAr: 'واجهة عربية وإنجليزية كاملة مع دعم فني على مدار الساعة بلغتك الأم وبدون قيود.', dEn: 'Full Arabic and English interface with 24/7 technical support in your native language, no restrictions.' },
]

export function Features() {
  const { lang } = useAppStore()

  return (
    <section id="features" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-[#9d4edd]/30 mb-4">
            <span className="text-xs font-medium text-[#9d4edd]">✨ {lang === 'ar' ? 'مميزاتنا' : 'Our Features'}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            {lang === 'ar' ? 'لماذا تختار ' : 'Why Choose '}
            <span className="text-gradient-electric">{lang === 'ar' ? 'منصتنا؟' : 'Our Platform?'}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {lang === 'ar'
              ? 'تجربة استثمارية متكاملة بأعلى المعايير العالمية، مصممة لتحقيق أقصى عائد ممكن بأقل مخاطرة.'
              : 'A complete investment experience built to the highest global standards, designed for maximum returns with minimum risk.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl"
                   style={{ background: `linear-gradient(135deg, ${f.color}40, ${f.color}10)` }} />
              <div className="relative glass rounded-3xl p-6 h-full border-white/5 hover:border-white/10 transition-all">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: `linear-gradient(135deg, ${f.color}30, ${f.color}10)`, border: `1px solid ${f.color}40` }}
                >
                  <f.icon className="h-7 w-7" style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {lang === 'ar' ? f.tAr : f.tEn}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lang === 'ar' ? f.dAr : f.dEn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
