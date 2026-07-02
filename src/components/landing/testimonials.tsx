'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { testimonials } from '@/lib/data'

export function Testimonials() {
  const { lang } = useAppStore()

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#9d4edd]/10 blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#00d4ff]/10 blur-[100px]" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-[#10b981]/30 mb-4">
            <span className="text-xs font-medium text-[#10b981]">💬 {lang === 'ar' ? 'آراء عملائنا' : 'Testimonials'}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            {lang === 'ar' ? 'قصص ' : 'Success '}
            <span className="text-gradient-electric">{lang === 'ar' ? 'نجاح حقيقية' : 'Stories'}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {lang === 'ar'
              ? 'انضم لأكثر من 250,000 مستثمر يثقون بنا حول العالم. هذه بعض من قصص نجاحهم.'
              : 'Join 250,000+ investors who trust us worldwide. Here are some of their success stories.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              className="glass rounded-3xl p-6 hover:border-white/20 transition-all"
            >
              <Quote className="h-8 w-8 text-[#00d4ff]/30 mb-3" />

              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-[#ffd700] text-[#ffd700]" />
                ))}
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed mb-6 min-h-[100px]">
                "{lang === 'ar' ? t.text.ar : t.text.en}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#9d4edd] flex items-center justify-center font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-1.5">
                    {t.name} <span>{t.country}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lang === 'ar' ? t.role.ar : t.role.en}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
