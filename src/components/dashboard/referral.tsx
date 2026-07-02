'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Copy, Check, Share2, Users, TrendingUp, Gift, ChevronRight, Send, MessageCircle, Twitter } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import QRCode from '@/components/ui/qrcode'

export function ReferralPage() {
  const { lang, user } = useAppStore()
  const isRtl = lang === 'ar'
  const [copied, setCopied] = useState(false)
  const referralLink = `https://cryptomine.io/r/${user?.id || 'AHMED2026'}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success(isRtl ? 'تم نسخ الرابط!' : 'Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const levels = [
    { level: 1, percent: 10, count: 8, earnings: 145.50, color: '#00d4ff' },
    { level: 2, percent: 5, count: 23, earnings: 78.25, color: '#9d4edd' },
    { level: 3, percent: 2, count: 67, earnings: 32.80, color: '#ffd700' },
  ]

  const commissions = [
    { user: 'Mohammed A.', level: 1, amount: 5.00, date: '2h ago' },
    { user: 'Layla K.', level: 1, amount: 4.00, date: '5h ago' },
    { user: 'John S.', level: 2, amount: 1.50, date: '8h ago' },
    { user: 'Sara M.', level: 1, amount: 3.00, date: '12h ago' },
    { user: 'David L.', level: 3, amount: 0.40, date: '1d ago' },
    { user: 'Aisha R.', level: 2, amount: 2.50, date: '2d ago' },
  ]

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {isRtl ? 'نظام الإحالات' : 'Referral System'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isRtl ? 'ادعُ أصدقاءك واربح عمولات مدى الحياة' : 'Invite friends and earn lifetime commissions'}
        </p>
      </motion.div>

      {/* Hero stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="relative overflow-hidden border-[#00d4ff]/30">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/10 via-transparent to-[#9d4edd]/10" />
          <div className="absolute -top-20 -end-20 w-80 h-80 rounded-full bg-[#00d4ff]/10 blur-3xl" />

          <div className="relative p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <Badge className="bg-[#00d4ff]/20 text-[#00d4ff] border-0 mb-3">
                  <Gift className="h-3 w-3 me-1" />
                  {isRtl ? 'عمولات مدى الحياة' : 'Lifetime Commissions'}
                </Badge>
                <h2 className="text-2xl font-bold mb-2">
                  {isRtl ? 'اربح حتى 17% من كل إحالة' : 'Earn up to 17% per referral'}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {isRtl
                    ? 'شارك رابطك واحصل على عمولات من 3 مستويات: 10% + 5% + 2% = 17% إجمالي'
                    : 'Share your link and earn across 3 tiers: 10% + 5% + 2% = 17% total'}
                </p>

                {/* Referral link */}
                <div className="space-y-2 mb-4">
                  <label className="text-xs text-muted-foreground">{isRtl ? 'رابط الإحالة' : 'Your Referral Link'}</label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={referralLink}
                      className="flex-1 px-4 py-2.5 rounded-xl glass border-white/10 bg-white/5 text-sm font-mono"
                    />
                    <Button
                      onClick={handleCopy}
                      className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Share buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="glass" onClick={() => toast.success(isRtl ? 'تمت المشاركة' : 'Shared!')}>
                    <Send className="h-3.5 w-3.5 me-1.5" />
                    Telegram
                  </Button>
                  <Button size="sm" variant="outline" className="glass" onClick={() => toast.success(isRtl ? 'تمت المشاركة' : 'Shared!')}>
                    <MessageCircle className="h-3.5 w-3.5 me-1.5" />
                    WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" className="glass" onClick={() => toast.success(isRtl ? 'تمت المشاركة' : 'Shared!')}>
                    <Twitter className="h-3.5 w-3.5 me-1.5" />
                    X
                  </Button>
                  <Button size="sm" variant="outline" className="glass" onClick={() => toast.success(isRtl ? 'تمت المشاركة' : 'Shared!')}>
                    <Share2 className="h-3.5 w-3.5 me-1.5" />
                    {isRtl ? 'مشاركة' : 'Share'}
                  </Button>
                </div>
              </div>

              {/* QR code */}
              <div className="flex flex-col items-center">
                <div className="p-4 rounded-2xl bg-white">
                  <QRCode value={referralLink} size={180} />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {isRtl ? 'امسح للانضمام' : 'Scan to join'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Levels grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levels.map((lvl, i) => (
          <motion.div
            key={lvl.level}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
          >
            <Card
              className="p-5 glass border-white/5 hover:border-white/10 transition-all"
              style={{ borderColor: `${lvl.color}30` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${lvl.color}, ${lvl.color}80)` }}
                >
                  L{lvl.level}
                </div>
                <Badge style={{ background: `${lvl.color}20`, color: lvl.color, border: 0 }}>
                  {lvl.percent}% {isRtl ? 'عمولة' : 'commission'}
                </Badge>
              </div>
              <h3 className="font-bold mb-1">
                {isRtl ? `المستوى ${lvl.level}` : `Level ${lvl.level}`}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {isRtl
                  ? lvl.level === 1 ? 'الإحالات المباشرة' : lvl.level === 2 ? 'إحالات إحالاتك' : 'المستوى الثالث'
                  : lvl.level === 1 ? 'Direct referrals' : lvl.level === 2 ? 'Their referrals' : 'Third level'}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div>
                  <div className="text-2xl font-black" style={{ color: lvl.color }}>{lvl.count}</div>
                  <div className="text-xs text-muted-foreground">{isRtl ? 'إحالة' : 'Referrals'}</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">${lvl.earnings}</div>
                  <div className="text-xs text-muted-foreground">{isRtl ? 'أرباح' : 'Earnings'}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* How it works */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 glass border-white/5">
          <h3 className="font-bold mb-4">{isRtl ? 'كيف يعمل؟' : 'How It Works'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Share2, title: isRtl ? 'شارك رابطك' : 'Share Your Link', desc: isRtl ? 'انسخ رابطك الفريد وشاركه مع أصدقائك وعائلتك' : 'Copy your unique link and share with friends and family', color: '#00d4ff' },
              { icon: Users, title: isRtl ? 'يسجلون ويستثمرون' : 'They Sign Up & Invest', desc: isRtl ? 'عند تسجيلهم واستثمارهم، يتم ربطهم بحسابك تلقائياً' : 'When they sign up and invest, they are linked to your account', color: '#9d4edd' },
              { icon: TrendingUp, title: isRtl ? 'اربح عمولات' : 'Earn Commissions', desc: isRtl ? 'احصل على عمولات تلقائياً على كل استثماراتهم الحالية والمستقبلية' : 'Get commissions automatically on all their current and future investments', color: '#ffd700' },
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${step.color}20`, border: `1px solid ${step.color}40` }}
                >
                  <step.icon className="h-5 w-5" style={{ color: step.color }} />
                </div>
                <div>
                  <div className="font-semibold mb-1">{step.title}</div>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Commission history */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-5 glass border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{isRtl ? 'سجل العمولات' : 'Commission History'}</h3>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
              {isRtl ? 'إجمالي' : 'Total'}: $256.55
            </Badge>
          </div>
          <div className="space-y-2">
            {commissions.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/30 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#9d4edd] flex items-center justify-center text-white font-bold text-sm">
                  {c.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{c.user}</div>
                  <div className="text-xs text-muted-foreground">
                    {isRtl ? `المستوى ${c.level}` : `Level ${c.level}`} • {c.date}
                  </div>
                </div>
                <div className="text-emerald-400 font-bold">+${c.amount.toFixed(2)}</div>
                <ChevronRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
