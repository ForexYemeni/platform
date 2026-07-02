'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, TrendingDown, Newspaper } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { newsItems, marketData } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function NewsPage() {
  const { lang, setView } = useAppStore()
  const isRtl = lang === 'ar'

  return (
    <div className="space-y-6 py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Button variant="ghost" onClick={() => setView('home')} className="mb-4">
            <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
            {isRtl ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>
          <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-[#00d4ff]" />
            {isRtl ? 'أخبار العملات الرقمية' : 'Crypto News'}
          </h1>
          <p className="text-muted-foreground">
            {isRtl ? 'آخر الأخبار والتحليلات من عالم العملات الرقمية' : 'Latest news and analysis from the crypto world'}
          </p>
        </motion.div>

        {/* Market overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-3">{isRtl ? 'السوق المباشر' : 'Live Market'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {marketData.slice(0, 10).map((coin, i) => (
              <Card key={i} className="p-4 glass border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{coin.symbol}</span>
                  {coin.change >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                  )}
                </div>
                <div className="text-sm font-medium">${coin.price.toLocaleString()}</div>
                <div className={`text-xs ${coin.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {coin.change >= 0 ? '+' : ''}{coin.change}%
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsItems.concat(newsItems).map((news, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden glass border-white/5 hover:border-white/15 transition-all cursor-pointer h-full">
                <div className="aspect-video bg-gradient-to-br from-[#00d4ff]/20 via-[#9d4edd]/15 to-[#ffd700]/10 flex items-center justify-center text-6xl">
                  {news.image}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-[#00d4ff]/15 text-[#00d4ff] border-0">
                      {isRtl ? news.category.ar : news.category.en}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{news.time}{isRtl ? ' مضى' : ' ago'}</span>
                  </div>
                  <h3 className="font-bold mb-2 leading-tight">
                    {isRtl ? news.title.ar : news.title.en}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isRtl ? news.summary.ar : news.summary.en}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
