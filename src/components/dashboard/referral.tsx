'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Copy, Check, Share2, Users, TrendingUp, Gift, ChevronRight, Send, MessageCircle, Twitter, Loader2, Crown, UserCheck, UserX } from 'lucide-react'
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
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/referral')
      if (res.ok) {
        const result = await res.json()
        if (result.success) setData(result.data)
      }
    } catch (e) {
      console.error('Failed to fetch referral data:', e)
    } finally {
      setLoading(false)
    }
  }

  const referralLink = data?.referralLink || `https://platform-eosin-chi.vercel.app/?ref=${user?.referralCode || ''}`
  const referralCode = user?.referralCode || data?.referralCode || ''

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success(isRtl ? 'تم نسخ الرابط!' : 'Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    toast.success(isRtl ? 'تم نسخ رمز الدعوة!' : 'Code copied!')
  }

  const handleShare = (platform: string) => {
    const text = isRtl
      ? 'انضم لي في CryptoMine - منصة التعدين الأفضل! استخدم رمز الدعوة: '
      : 'Join me on CryptoMine - the best mining platform! Use referral code: '
    const url = `${text}${referralCode}\n${referralLink}`

    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text + referralCode)}`, '_blank')
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(url)}`, '_blank')
    } else {
      navigator.clipboard.writeText(url)
      toast.success(isRtl ? 'تم نسخ النص!' : 'Copied!')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#00d4ff]" />
      </div>
    )
  }

  const levels = data?.levels || [
    { level: 1, count: 0, activeCount: 0, percent: 10, earnings: 0, users: [] },
    { level: 2, count: 0, activeCount: 0, percent: 5, earnings: 0, users: [] },
    { level: 3, count: 0, activeCount: 0, percent: 2, earnings: 0, users: [] },
  ]

  const stats = data?.stats || { totalReferrals: 0, activeReferrals: 0, totalEarnings: 0 }
  const recentCommissions = data?.recentCommissions || []

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {isRtl ? 'نظام الإحالات' : 'Referral System'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isRtl ? 'ادعُ أصدقاءك واربح عمولات مدى الحياة من 3 مستويات' : 'Invite friends and earn lifetime commissions across 3 levels'}
        </p>
      </motion.div>

      {/* Hero card with referral link */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
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
                    ? 'شارك رمز الدعوة واحصل على عمولات من 3 مستويات: 10% + 5% + 2% = 17% إجمالي'
                    : 'Share your referral code and earn across 3 tiers: 10% + 5% + 2% = 17% total'}
                </p>

                {/* Referral Code */}
                <div className="space-y-2 mb-4">
                  <label className="text-xs text-muted-foreground">{isRtl ? 'رمز الدعوة الخاص بك' : 'Your Referral Code'}</label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={referralCode}
                      className="flex-1 px-4 py-2.5 rounded-xl glass border-[#00d4ff]/30 bg-[#00d4ff]/5 text-sm font-mono font-bold text-center text-[#00d4ff]"
                    />
                    <Button onClick={handleCopyCode} className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Referral Link */}
                <div className="space-y-2 mb-4">
                  <label className="text-xs text-muted-foreground">{isRtl ? 'رابط الإحالة' : 'Referral Link'}</label>
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
                  <Button size="sm" variant="outline" className="glass" onClick={() => handleShare('telegram')}>
                    <Send className="h-3.5 w-3.5 me-1.5" />Telegram
                  </Button>
                  <Button size="sm" variant="outline" className="glass" onClick={() => handleShare('whatsapp')}>
                    <MessageCircle className="h-3.5 w-3.5 me-1.5" />WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" className="glass" onClick={() => handleShare('twitter')}>
                    <Twitter className="h-3.5 w-3.5 me-1.5" />X
                  </Button>
                  <Button size="sm" variant="outline" className="glass" onClick={() => handleShare('copy')}>
                    <Share2 className="h-3.5 w-3.5 me-1.5" />{isRtl ? 'مشاركة' : 'Share'}
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="p-5 glass border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00d4ff]/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#00d4ff]" />
              </div>
              <div>
                <div className="text-2xl font-black">{stats.totalReferrals}</div>
                <div className="text-xs text-muted-foreground">{isRtl ? 'إجمالي الإحالات' : 'Total Referrals'}</div>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
          <Card className="p-5 glass border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#10b981]/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-[#10b981]" />
              </div>
              <div>
                <div className="text-2xl font-black">{stats.activeReferrals}</div>
                <div className="text-xs text-muted-foreground">{isRtl ? 'إحالات نشطة' : 'Active Referrals'}</div>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="p-5 glass border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ffd700]/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#ffd700]" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#ffd700]">${stats.totalEarnings.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">{isRtl ? 'إجمالي الأرباح' : 'Total Earnings'}</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Levels grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levels.map((lvl: any, i: number) => (
          <motion.div key={lvl.level} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 + i * 0.05 }}>
            <Card
              className="p-5 glass border-white/5 hover:border-white/10 transition-all"
              style={{ borderColor: `${['#00d4ff', '#9d4edd', '#ffd700'][i]}30` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${['#00d4ff', '#9d4edd', '#ffd700'][i]}, ${['#00d4ff', '#9d4edd', '#ffd700'][i]}80)` }}
                >
                  L{lvl.level}
                </div>
                <Badge style={{ background: `${['#00d4ff', '#9d4edd', '#ffd700'][i]}20`, color: ['#00d4ff', '#9d4edd', '#ffd700'][i], border: 0 }}>
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
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                <div>
                  <div className="text-lg font-black" style={{ color: ['#00d4ff', '#9d4edd', '#ffd700'][i] }}>{lvl.count}</div>
                  <div className="text-[10px] text-muted-foreground">{isRtl ? 'الكل' : 'Total'}</div>
                </div>
                <div>
                  <div className="text-lg font-black text-emerald-400">{lvl.activeCount}</div>
                  <div className="text-[10px] text-muted-foreground">{isRtl ? 'نشط' : 'Active'}</div>
                </div>
                <div>
                  <div className="text-lg font-black text-[#ffd700]">${lvl.earnings.toFixed(2)}</div>
                  <div className="text-[10px] text-muted-foreground">{isRtl ? 'أرباح' : 'Earned'}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Referred users list (Level 1) */}
      {levels[0]?.users?.length > 0 && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="p-5 glass border-white/5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#00d4ff]" />
              {isRtl ? 'المستخدمون الذين أحلتهم' : 'Your Referred Users'}
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-luxury">
              {levels[0].users.map((u: any, i: number) => (
                <div key={u.id || i} className="flex items-center gap-3 p-3 rounded-xl glass">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#9d4edd] flex items-center justify-center text-white font-bold text-sm">
                    {u.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {isRtl ? 'انضم:' : 'Joined:'} {new Date(u.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                  {u.hasActivePlan ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0 gap-1">
                      <UserCheck className="h-3 w-3" />
                      {isRtl ? 'نشط' : 'Active'}
                    </Badge>
                  ) : (
                    <Badge className="bg-muted/20 text-muted-foreground border-0 gap-1">
                      <UserX className="h-3 w-3" />
                      {isRtl ? 'غير نشط' : 'Inactive'}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* How it works */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}>
        <Card className="p-6 glass border-white/5">
          <h3 className="font-bold mb-4">{isRtl ? 'كيف يعمل؟' : 'How It Works'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Share2, title: isRtl ? 'شارك رمزك' : 'Share Your Code', desc: isRtl ? 'انسخ رمز الدعوة أو الرابط وشاركه' : 'Copy your code or link and share it', color: '#00d4ff' },
              { icon: Users, title: isRtl ? 'يسجلون ويستثمرون' : 'They Sign Up & Invest', desc: isRtl ? 'يجب استخدام رمزك عند التسجيل' : 'They must use your code when registering', color: '#9d4edd' },
              { icon: TrendingUp, title: isRtl ? 'اربح عمولات' : 'Earn Commissions', desc: isRtl ? '10% + 5% + 2% من استثماراتهم' : '10% + 5% + 2% of their investments', color: '#ffd700' },
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
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
        <Card className="p-5 glass border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{isRtl ? 'سجل العمولات' : 'Commission History'}</h3>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
              {isRtl ? 'إجمالي' : 'Total'}: ${stats.totalEarnings.toFixed(2)}
            </Badge>
          </div>
          {recentCommissions.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {isRtl ? 'لا توجد عمولات بعد. ابدأ بدعوة أصدقائك!' : 'No commissions yet. Start inviting friends!'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-luxury">
              {recentCommissions.map((c: any, i: number) => (
                <div key={c.id || i} className="flex items-center gap-3 p-3 rounded-xl glass">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#9d4edd] flex items-center justify-center text-white font-bold text-sm">
                    {c.userName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{c.userName}</div>
                    <div className="text-xs text-muted-foreground">
                      {isRtl ? `المستوى ${c.level}` : `Level ${c.level}`} • {c.percentage}% • {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-emerald-400 font-bold">+${c.amount.toFixed(2)}</div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
