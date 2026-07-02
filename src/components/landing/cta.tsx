'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Gift, Sparkles } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

export function CTA() {
  const { lang, setAuthStage } = useAppStore()

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-16 text-center"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff] via-[#9d4edd] to-[#ffd700] opacity-20" />
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#00d4ff]/30 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#9d4edd]/30 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-[#ffd700]/40 mb-6"
            >
              <Gift className="h-4 w-4 text-[#ffd700]" />
              <span className="text-xs font-medium text-[#ffd700]">
                {lang === 'ar' ? 'مكافأة ترحيب 25$ لأول 1000 مستخدم' : '$25 Welcome Bonus for first 1000 users'}
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              {lang === 'ar' ? 'جاهز لبدء ' : 'Ready to Start '}
              <span className="text-gradient-electric">{lang === 'ar' ? 'رحلتك؟' : 'Your Journey?'}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {lang === 'ar'
                ? 'انضم اليوم واحصل على مكافأة ترحيب 25$، خطة أساسية مجانية لمدة 7 أيام، ودخول في سحوبات شهرية بقيمة 50,000$.'
                : 'Join today and get a $25 welcome bonus, 7-day free Basic plan, and entry into monthly $50,000 giveaways.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setAuthStage('register')}
                className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] hover:from-[#00d4ff]/90 hover:to-[#9d4edd]/90 text-white border-0 px-10 h-14 text-base glow-electric group"
              >
                <Sparkles className="h-5 w-5 me-2" />
                {lang === 'ar' ? 'أنشئ حسابك المجاني' : 'Create Free Account'}
                <ArrowRight className="h-5 w-5 ms-2 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </Button>
              <div className="text-xs text-muted-foreground text-center sm:text-start">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[#ffd700]">★★★★★</span>
                </div>
                <div>{lang === 'ar' ? 'انضم لـ 250,000+ مستثمر' : 'Join 250,000+ investors'}</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span>✓ {lang === 'ar' ? 'تسجيل في دقيقة' : '1-minute signup'}</span>
              <span>✓ {lang === 'ar' ? 'بدون رسوم خفية' : 'No hidden fees'}</span>
              <span>✓ {lang === 'ar' ? 'دعم 24/7' : '24/7 support'}</span>
              <span>✓ {lang === 'ar' ? 'سحب فوري' : 'Instant withdrawals'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
