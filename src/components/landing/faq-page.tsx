'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { faqItems } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function FaqPage() {
  const { lang, setView } = useAppStore()
  const isRtl = lang === 'ar'
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [search, setSearch] = useState('')

  const filtered = faqItems.filter(item =>
    (isRtl ? item.q.ar : item.q.en).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Button variant="ghost" onClick={() => setView('home')} className="mb-4">
            <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
            {isRtl ? 'العودة' : 'Back'}
          </Button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-[#9d4edd]/30 mb-4">
            <HelpCircle className="h-3 w-3 text-[#9d4edd]" />
            <span className="text-xs font-medium text-[#9d4edd]">{isRtl ? 'مركز المساعدة' : 'Help Center'}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            {isRtl ? 'كيف يمكننا ' : 'How can we '}
            <span className="text-gradient-electric">{isRtl ? 'مساعدتك؟' : 'help you?'}</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            {isRtl ? 'إجابات شاملة على أكثر الأسئلة شيوعاً' : 'Comprehensive answers to common questions'}
          </p>
          <div className="relative max-w-xl mx-auto">
            <Input
              placeholder={isRtl ? 'ابحث عن سؤالك...' : 'Search for your question...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 bg-white/5 glass border-white/10"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto space-y-3"
        >
          {filtered.map((item, i) => (
            <Card key={i} className="glass border-white/5 hover:border-white/10 transition-all overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-start"
              >
                <span className="font-semibold">{isRtl ? item.q.ar : item.q.en}</span>
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }}>
                  <ChevronDown className="h-5 w-5 text-[#00d4ff] flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {isRtl ? item.a.ar : item.a.en}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{isRtl ? 'لا توجد نتائج' : 'No results found'}</p>
            </div>
          )}
        </motion.div>

        {/* Contact support */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <Card className="p-8 glass border-[#00d4ff]/20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#9d4edd] mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">{isRtl ? 'لم تجد إجابتك؟' : "Didn't find your answer?"}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isRtl ? 'فريق الدعم متاح 24/7 للإجابة على جميع استفساراتك' : 'Our support team is available 24/7 to answer all your questions'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0">
                <MessageCircle className="h-4 w-4 me-2" />
                {isRtl ? 'محادثة مباشرة' : 'Live Chat'}
              </Button>
              <Button variant="outline" className="glass">
                {isRtl ? 'تواصل عبر البريد' : 'Email Support'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
