'use client'

import { motion } from 'framer-motion'
import { Check, Crown, ArrowRight, Sparkles } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { miningPlans } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Plans() {
  const { lang, setAuthStage, user, setView } = useAppStore()

  const handleChoosePlan = () => {
    if (user) {
      setView('mining')
    } else {
      setAuthStage('register')
    }
  }

  return (
    <section id="plans" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#9d4edd]/10 blur-[120px]" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-[#ffd700]/30 mb-4">
            <Sparkles className="h-3 w-3 text-[#ffd700]" />
            <span className="text-xs font-medium text-[#ffd700]">{lang === 'ar' ? 'خطط الاستثمار' : 'Investment Plans'}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            {lang === 'ar' ? 'اختر خطتك ' : 'Choose Your '}
            <span className="text-gradient-gold">{lang === 'ar' ? 'للنجاح' : 'Path to Success'}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {lang === 'ar'
              ? 'أرباح يومية مضمونة مع إمكانية السحب الفوري وإعادة الاستثمار. كلما زاد استثمارك، زادت أرباحك اليومية.'
              : 'Guaranteed daily profits with instant withdrawals and auto-reinvest. The more you invest, the higher your daily returns.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {miningPlans.map((plan, i) => {
            const totalReturn = plan.investment * plan.dailyProfit * plan.duration / 100
            return (
              <motion.div
                key={plan.id}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-[#ffd700] to-[#ff8c00] text-black border-0 px-3 py-1 shadow-lg">
                      <Crown className="h-3 w-3 me-1" />
                      {lang === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                    </Badge>
                  </div>
                )}

                <div
                  className={`relative h-full rounded-3xl overflow-hidden border ${
                    plan.popular ? 'border-[#ffd700]/40 glow-gold' : 'border-white/10'
                  }`}
                  style={{
                    background: `linear-gradient(180deg, ${plan.color}15, transparent 50%), var(--card)`,
                  }}
                >
                  {/* Top accent */}
                  <div className={`h-1 w-full bg-gradient-to-r ${plan.gradient}`} />

                  <div className="p-6">
                    {/* Plan name */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xl font-bold">
                          {lang === 'ar'
                            ? { basic: 'الأساسية', silver: 'الفضية', gold: 'الذهبية', diamond: 'الماسية' }[plan.id]
                            : plan.nameKey.charAt(0).toUpperCase() + plan.nameKey.slice(1)}
                        </h3>
                        <span
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: `${plan.color}30`, color: plan.color }}
                        >
                          {plan.id === 'basic' && '🥉'}
                          {plan.id === 'silver' && '🥈'}
                          {plan.id === 'gold' && '🥇'}
                          {plan.id === 'diamond' && '💎'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{plan.hashrate} • {plan.duration} {lang === 'ar' ? 'يوم' : 'days'}</p>
                    </div>

                    {/* Investment */}
                    <div className="mb-4 pb-4 border-b border-border">
                      <div className="text-xs text-muted-foreground mb-1">
                        {lang === 'ar' ? 'الاستثمار' : 'Investment'}
                      </div>
                      <div className="text-4xl font-black">
                        <span className="text-gradient-electric">${plan.investment}</span>
                      </div>
                    </div>

                    {/* Daily profit */}
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl glass">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {lang === 'ar' ? 'يومي' : 'Daily'}
                        </div>
                        <div className="text-xl font-bold text-emerald-400">
                          {plan.dailyProfit}%
                        </div>
                      </div>
                      <div className="p-3 rounded-xl glass">
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {lang === 'ar' ? 'إجمالي' : 'Total'}
                        </div>
                        <div className="text-xl font-bold text-[#ffd700]">
                          ${totalReturn.toFixed(0)}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-6 min-h-[140px]">
                      {plan.features.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-xs">
                          <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                          <span className="text-muted-foreground">{lang === 'ar' ? feat.ar : feat.en}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button
                      onClick={handleChoosePlan}
                      className={`w-full h-11 border-0 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-[#ffd700] to-[#ff8c00] text-black hover:opacity-90'
                          : 'bg-gradient-to-r ' + plan.gradient + ' text-white hover:opacity-90'
                      }`}
                    >
                      {lang === 'ar' ? 'اختر الخطة' : 'Choose Plan'}
                      <ArrowRight className="h-4 w-4 ms-2 rtl:rotate-180" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Guarantee banner */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 glass rounded-3xl p-6 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: '🔒', label: lang === 'ar' ? 'أموالك محمية 100%' : '100% Funds Protected' },
            { icon: '⚡', label: lang === 'ar' ? 'سحب فوري' : 'Instant Withdrawals' },
            { icon: '🔄', label: lang === 'ar' ? 'إعادة استثمار تلقائي' : 'Auto-Reinvest' },
            { icon: '🎯', label: lang === 'ar' ? 'أرباح مضمونة' : 'Guaranteed Returns' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
