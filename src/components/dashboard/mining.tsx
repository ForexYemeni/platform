'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cpu, Clock, RefreshCw, Crown, Zap, Loader2, X, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface Plan {
  id: string
  name: string
  nameAr: string
  investment: number
  dailyProfit: number
  duration: number
  hashrate: string
  color: string
  gradient: string
  icon: string
  popular: boolean
  active: boolean
  features: any
}

export function MiningPage() {
  const { lang, user, setAuthStage, fetchCurrentUser } = useAppStore()
  const isRtl = lang === 'ar'
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState<string | null>(null)
  const [liveProfit, setLiveProfit] = useState(0)

  // Fetch real plans from API
  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/mining')
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setPlans(data.data.plans || [])
        }
      }
    } catch (e) {
      console.error('Failed to fetch plans:', e)
    } finally {
      setLoading(false)
    }
  }

  // Check if user has active plan
  const hasActivePlan = user?.activePlan && user?.planExpiresAt && new Date(user.planExpiresAt) > new Date()
  const activePlan = hasActivePlan ? user!.activePlan : null

  // Calculate time remaining
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    if (!hasActivePlan || !user?.planExpiresAt) return

    const calc = () => {
      const diff = new Date(user.planExpiresAt!).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [user?.planExpiresAt, hasActivePlan])

  // Live profit counter - REAL cumulative calculation
  // Profit accrues continuously based on time elapsed since plan activation
  useEffect(() => {
    if (!hasActivePlan || !user?.planActivatedAt || !user?.activePlan) {
      setLiveProfit(0)
      return
    }

    const dailyProfitAmount = user.activePlan.investment * user.activePlan.dailyProfit / 100
    const planActivatedAt = new Date(user.planActivatedAt).getTime()

    const calcProfit = () => {
      const now = Date.now()
      const elapsedMs = now - planActivatedAt
      const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24)
      // Profit = dailyProfit * days elapsed (continuous accrual)
      const earned = dailyProfitAmount * elapsedDays
      // Subtract already-claimed profit (totalProfit represents claimed/credited amount)
      const unclaimed = Math.max(0, earned - (user.totalProfit || 0))
      setLiveProfit(unclaimed)
    }

    calcProfit()
    // Update every second for smooth counter
    const interval = setInterval(calcProfit, 1000)
    return () => clearInterval(interval)
  }, [hasActivePlan, user?.planActivatedAt, user?.activePlan, user?.totalProfit])

  const handleActivate = async (planId: string) => {
    if (!user) {
      setAuthStage('register')
      return
    }
    setActivating(planId)
    try {
      const res = await fetch('/api/user/mining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(isRtl ? 'تم تفعيل الخطة بنجاح!' : 'Plan activated successfully!')
        await fetchCurrentUser()
      } else {
        toast.error(data.error || (isRtl ? 'فشل التفعيل' : 'Activation failed'))
      }
    } catch (e) {
      toast.error(isRtl ? 'خطأ في الشبكة' : 'Network error')
    } finally {
      setActivating(null)
    }
  }

  const [showReinvestModal, setShowReinvestModal] = useState(false)
  const [reinvesting, setReinvesting] = useState(false)

  const handleReinvest = async () => {
    setReinvesting(true)
    try {
      const res = await fetch('/api/user/mining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reinvest' })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(isRtl ? `✅ تمت إعادة استثمار $${data.data.amount.toFixed(4)}!` : `✅ Reinvested $${data.data.amount.toFixed(4)}!`)
        setShowReinvestModal(false)
        await fetchCurrentUser()
      } else {
        toast.error(data.error || 'Failed')
      }
    } catch (e) {
      toast.error(isRtl ? 'خطأ في الشبكة' : 'Network error')
    } finally {
      setReinvesting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#00d4ff]" />
      </div>
    )
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {isRtl ? 'مركز التعدين' : 'Mining Center'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isRtl ? 'تابع التعدين المباشر وأداء خططك الاستثمارية' : 'Monitor live mining and your investment plan performance'}
        </p>
      </motion.div>

      {/* Active plan or empty state */}
      {hasActivePlan && activePlan ? (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="relative overflow-hidden border-[#ffd700]/30">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/10 via-transparent to-[#9d4edd]/10" />
            <div className="absolute -top-20 -end-20 w-80 h-80 rounded-full bg-[#ffd700]/10 blur-3xl" />

            <div className="relative p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ffd700] to-[#ff8c00] flex items-center justify-center text-2xl">
                      {activePlan.icon === 'gold' ? '🥇' : activePlan.icon === 'diamond' ? '💎' : activePlan.icon === 'silver' ? '🥈' : '🥉'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {isRtl ? activePlan.nameAr : activePlan.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-0 gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {isRtl ? 'تعدين نشط' : 'Mining Active'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{activePlan.hashrate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 rounded-xl glass">
                    <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'الاستثمار' : 'Invested'}</div>
                    <div className="text-lg font-bold">${activePlan.investment}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl glass">
                    <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'يومي' : 'Daily'}</div>
                    <div className="text-lg font-bold text-emerald-400">+{activePlan.dailyProfit}%</div>
                  </div>
                  <div className="text-center p-3 rounded-xl glass">
                    <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'مكتسب' : 'Earned'}</div>
                    <div className="text-lg font-bold text-[#ffd700]">${(user?.totalProfit || 0).toFixed(2)}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl glass">
                    <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'المتبقي' : 'Remaining'}</div>
                    <div className="text-lg font-bold">{timeLeft.days}d</div>
                  </div>
                </div>
              </div>

              {/* Live profit + countdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-2xl glass border-[#00d4ff]/20 bg-[#00d4ff]/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Zap className="h-3 w-3 text-[#00d4ff]" />
                      {isRtl ? 'الربح المباشر' : 'Live Profit'}
                    </span>
                    <Badge className="bg-[#00d4ff]/20 text-[#00d4ff] border-0 gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
                      {isRtl ? 'مباشر' : 'Live'}
                    </Badge>
                  </div>
                  <div className="text-3xl font-black text-gradient-electric mb-1">
                    +${liveProfit.toFixed(4)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isRtl ? 'يُحدّث تلقائياً' : 'Updates automatically'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-[#9d4edd]" />
                    {isRtl ? 'الوقت المتبقي' : 'Time Remaining'}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: isRtl ? 'يوم' : 'Days', value: timeLeft.days },
                      { label: isRtl ? 'ساعة' : 'Hrs', value: timeLeft.hours },
                      { label: isRtl ? 'دقيقة' : 'Min', value: timeLeft.minutes },
                      { label: isRtl ? 'ثانية' : 'Sec', value: timeLeft.seconds },
                    ].map((t, i) => (
                      <div key={i} className="text-center">
                        <div className="text-xl font-bold text-[#9d4edd]">{String(t.value).padStart(2, '0')}</div>
                        <div className="text-[10px] text-muted-foreground">{t.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress */}
              {user?.planActivatedAt && user?.planExpiresAt && (
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isRtl ? 'تقدم الخطة' : 'Plan Progress'}</span>
                    <span className="font-semibold">
                      {Math.min(100, Math.round(
                        ((Date.now() - new Date(user.planActivatedAt).getTime()) /
                          (new Date(user.planExpiresAt).getTime() - new Date(user.planActivatedAt).getTime())) * 100
                      ))}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(100, Math.round(
                      ((Date.now() - new Date(user.planActivatedAt).getTime()) /
                        (new Date(user.planExpiresAt).getTime() - new Date(user.planActivatedAt).getTime())) * 100
                    ))}
                    className="h-3"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowReinvestModal(true)}
                  className="flex-1 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0"
                >
                  <RefreshCw className="h-4 w-4 me-2" />
                  {isRtl ? 'إعادة استثمار الأرباح' : 'Reinvest Profits'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        // No active plan
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="relative overflow-hidden border-[#9d4edd]/30 p-8 text-center">
            <div className="absolute -top-20 -end-20 w-80 h-80 rounded-full bg-[#9d4edd]/10 blur-3xl" />
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-[#9d4edd]/10 flex items-center justify-center mx-auto mb-4">
                <Cpu className="h-10 w-10 text-[#9d4edd]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {isRtl ? 'لا توجد خطة تعدين نشطة' : 'No Active Mining Plan'}
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                {isRtl
                  ? 'اختر إحدى الخطط أدناه لبدء التعدين وكسب الأرباح اليومية. يجب أن يكون لديك رصيد كافٍ في حسابك.'
                  : 'Choose one of the plans below to start mining and earn daily profits. You need sufficient balance in your account.'}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass">
                <span className="text-sm text-muted-foreground">{isRtl ? 'رصيدك الحالي' : 'Your balance'}:</span>
                <span className="text-lg font-bold text-[#ffd700]">${(user?.balance || 0).toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* All plans */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <h3 className="text-xl font-bold mb-4">{isRtl ? 'الخطط المتاحة' : 'Available Plans'}</h3>
        {plans.length === 0 ? (
          <Card className="p-8 text-center glass border-white/5">
            <p className="text-sm text-muted-foreground">
              {isRtl ? 'لا توجد خطط متاحة حالياً' : 'No plans available'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.filter(p => p.active).map((plan) => {
              const isCurrent = activePlan?.id === plan.id
              const canAfford = (user?.balance || 0) >= plan.investment
              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden cursor-pointer transition-all hover:border-white/20 ${
                    isCurrent ? 'border-[#ffd700]/40 glow-gold' : 'border-white/5'
                  }`}
                >
                  <div className={`h-1.5 w-full bg-gradient-to-r ${plan.gradient}`} />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold">
                        {isRtl ? plan.nameAr : plan.name}
                      </h4>
                      {isCurrent ? (
                        <Badge className="bg-[#ffd700]/20 text-[#ffd700] border-0">{isRtl ? 'نشط' : 'Active'}</Badge>
                      ) : (
                        <span className="text-2xl">
                          {plan.icon === 'basic' ? '🥉' : plan.icon === 'silver' ? '🥈' : plan.icon === 'gold' ? '🥇' : '💎'}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRtl ? 'الاستثمار' : 'Investment'}</span>
                        <span className="font-semibold">${plan.investment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRtl ? 'يومي' : 'Daily'}</span>
                        <span className="font-semibold text-emerald-400">{plan.dailyProfit}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRtl ? 'المدة' : 'Duration'}</span>
                        <span className="font-semibold">{plan.duration} {isRtl ? 'يوم' : 'days'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isRtl ? 'القوة' : 'Hashrate'}</span>
                        <span className="font-semibold">{plan.hashrate}</span>
                      </div>
                    </div>

                    {/* Total expected profit - REAL calculation */}
                    <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-[#10b981]/10 to-[#ffd700]/10 border border-[#10b981]/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{isRtl ? 'إجمالي الأرباح المتوقعة' : 'Total Expected Profit'}</span>
                        <span className="text-base font-black text-emerald-400">
                          +${(plan.investment * plan.dailyProfit * plan.duration / 100).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {isRtl
                          ? `${plan.dailyProfit}% × ${plan.duration} يوم = ${(plan.dailyProfit * plan.duration).toFixed(0)}% عائد`
                          : `${plan.dailyProfit}% × ${plan.duration} days = ${(plan.dailyProfit * plan.duration).toFixed(0)}% return`}
                      </div>
                    </div>
                    {!isCurrent && (
                      <Button
                        size="sm"
                        className={`w-full mt-4 bg-gradient-to-r ${plan.gradient} text-white border-0`}
                        disabled={!canAfford || activating === plan.id}
                        onClick={(e) => { e.stopPropagation(); handleActivate(plan.id) }}
                      >
                        {activating === plan.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : !canAfford ? (
                          isRtl ? 'رصيد غير كافٍ' : 'Insufficient balance'
                        ) : (
                          isRtl ? 'تفعيل' : 'Activate'
                        )}
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Reinvest/Withdraw Approval Modal */}
      <AnimatePresence>
        {showReinvestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !reinvesting && setShowReinvestModal(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md"
            >
              <div className="relative glass rounded-3xl border-white/10 overflow-hidden">
                {/* Background effects */}
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#10b981]/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#ffd700]/20 blur-3xl" />

                {/* Close button */}
                <button
                  onClick={() => !reinvesting && setShowReinvestModal(false)}
                  className="absolute top-4 end-4 z-20 w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative p-8">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#10b981] to-[#ffd700] flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-center mb-2">
                    {isRtl ? 'إعادة استثمار الأرباح' : 'Reinvest Profits'}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    {isRtl
                      ? 'سيتم إضافة أرباحك المتراكمة إلى رصيدك'
                      : 'Your accumulated profits will be added to your balance'}
                  </p>

                  {/* Amount display */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#10b981]/10 to-[#ffd700]/10 border border-[#10b981]/20 mb-6">
                    <div className="text-xs text-muted-foreground text-center mb-1">
                      {isRtl ? 'الأرباح المتراكمة' : 'Accumulated Profit'}
                    </div>
                    <div className="text-4xl font-black text-center text-gradient-electric">
                      ${liveProfit.toFixed(6)}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm p-3 rounded-xl glass">
                      <span className="text-muted-foreground">{isRtl ? 'الخطة النشطة' : 'Active Plan'}</span>
                      <span className="font-medium">{isRtl ? user?.activePlan?.nameAr : user?.activePlan?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm p-3 rounded-xl glass">
                      <span className="text-muted-foreground">{isRtl ? 'الربح اليومي' : 'Daily Profit'}</span>
                      <span className="font-medium text-emerald-400">
                        +${(user?.activePlan ? user.activePlan.investment * user.activePlan.dailyProfit / 100 : 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm p-3 rounded-xl glass">
                      <span className="text-muted-foreground">{isRtl ? 'مدة التراكم' : 'Accrual Period'}</span>
                      <span className="font-medium">
                        {user?.planActivatedAt
                          ? `${Math.floor((Date.now() - new Date(user.planActivatedAt).getTime()) / (1000 * 60 * 60 * 24))} ${isRtl ? 'يوم' : 'days'}`
                          : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-200/80">
                        {isRtl
                          ? 'بعد السحب، سيبدأ عداد الأرباح من جديد. يمكنك السحب في أي وقت.'
                          : 'After withdrawal, the profit counter will reset. You can withdraw anytime.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 glass"
                      onClick={() => setShowReinvestModal(false)}
                      disabled={reinvesting}
                    >
                      {isRtl ? 'إلغاء' : 'Cancel'}
                    </Button>
                    <Button
                      onClick={handleReinvest}
                      disabled={reinvesting || liveProfit <= 0}
                      className="flex-1 bg-gradient-to-r from-[#10b981] to-[#ffd700] text-white border-0"
                    >
                      {reinvesting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 me-2" />
                          {isRtl ? 'تأكيد إعادة الاستثمار' : 'Confirm Reinvest'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
