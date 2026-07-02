'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { faqItems } from '@/lib/data'

export function FAQ() {
  const { lang } = useAppStore()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-24 lg:py-32 overflow-hidden">
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
            <HelpCircle className="h-3 w-3 text-[#9d4edd]" />
            <span className="text-xs font-medium text-[#9d4edd]">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            {lang === 'ar' ? 'لديك ' : 'Got '}
            <span className="text-gradient-electric">{lang === 'ar' ? 'أسئلة؟' : 'Questions?'}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {lang === 'ar'
              ? 'إجابات على أكثر الأسئلة شيوعاً حول منصتنا وخدماتنا.'
              : 'Answers to the most common questions about our platform and services.'}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden border-white/5 hover:border-white/10 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-start"
              >
                <span className="font-semibold text-base">
                  {lang === 'ar' ? item.q.ar : item.q.en}
                </span>
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="h-5 w-5 text-[#00d4ff] flex-shrink-0" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {lang === 'ar' ? item.a.ar : item.a.en}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
