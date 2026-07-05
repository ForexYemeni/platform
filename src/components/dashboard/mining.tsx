'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cpu, Clock, RefreshCw, Crown, Zap, Loader2, X, CheckCircle2, TrendingUp, AlertCircle, Power, Wallet } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
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
  const [miningSettings, setMiningSettings] = useState<any>(null)
  const [miningData, setMiningData] = useState<any>(null)
  const [liveProfit, setLiveProfit] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, percent: 0 })
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)

  useEffect(() => {
    fetchMiningData()
  }, [])

  const fetchMiningData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/mining')
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setPlans(data.data.plans || [])
          setMiningSettings(data.data.settings)
          setMiningData(data.data.mining)
        }
      }
    } catch (e) {
      console.error('Failed to fetch mining data:', e)
    } finally {
      setLoading(false)
    }
  }

  // Live profit + countdown for active mining
  useEffect(() => {
    if (!miningData?.isMiningActive || !user?.activePlan) {
      setLiveProfit(0)
      return
    }

    const plan = user.activePlan
    const dailyProfitAmount = plan.investment * plan.dailyProfit / 100
    const startTime = miningData.lastActivation ? new Date(miningData.lastActivation).getTime() : Date.now()

    const calcProfit = () => {
      const now = Date.now()
      const elapsedMs = now - startTime
      const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24)
      const profit = dailyProfitAmount * elapsedDays
      setLiveProfit(profit)

      // Calculate time remaining
      if (miningData.expiresAt) {
        const expires = new Date(miningData.expiresAt).getTime()
        const remaining = expires - now
        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60))
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (60 * 1000))
          const seconds = Math.floor((remaining % (60 * 1000)) / 1000)
          const total = miningSettings?.miningDurationHours || 24
          const elapsed = total * 60 * 60 * 1000 - remaining
          const percent = Math.min(100, (elapsed / (total * 60 * 60 * 1000)) * 100)
          setTimeLeft({ hours, minutes, seconds, percent })
        } else {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0, percent: 100 })
        }
      }
    }

    calcProfit()
    const interval = setInterval(calcProfit, 1000)
    return () => clearInterval(interval)
  }, [miningData, user?.activePlan, miningSettings])

  const hasActivePlan = user?.activePlan && user?.planExpiresAt && new Date(user.planExpiresAt) > new Date()
  const isMiningActive = miningData?.isMiningActive

  const handleActivateMining = async () => {
    setActivating('mining')
    try {
      const res = await fetch('/api/user/mining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'activateMining' })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(isRtl ? '⛏️ تم تفعيل التعدين اليومي!' : '⛏️ Daily mining activated!')
        fetchMiningData()
        fetchCurrentUser()
      } else {
        toast.error(data.error || 'Failed')
      }
    } catch (e) {
      toast.error('Network error')
    } finally {
      setActivating(null)
    }
  }

  const handleToggleAutoRenew = async () => {
    try {
      const res = await fetch('/api/user/mining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleAutoRenew' })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.data.autoRenew
          ? (isRtl ? '✅ تم تفعيل التعدين التلقائي' : '✅ Auto-renew enabled')
          : (isRtl ? '❌ تم إيقاف التعدين التلقائي' : '❌ Auto-renew disabled')
        )
        fetchMiningData()
      }
    } catch (e) {
      toast.error('Network error')
    }
  }

  const handleActivatePlan = async (planId: string) => {
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
        toast.success(isRtl ? '🎉 تم تفعيل الخطة! فعّل التعدين اليومي لكسب الأرباح' : '🎉 Plan activated! Activate daily mining to earn')
        fetchMiningData()
        fetchCurrentUser()
      } else {
        toast.error(data.error || 'Failed')
      }
    } catch (e) {
      toast.error('Network error')
    } finally {
      setActivating(null)
    }
  }

  const handleWithdrawProfits = async () => {
    setWithdrawing(true)
    try {
      const res = await fetch('/api/user/mining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'withdrawProfits' })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(isRtl ? `✅ تم سحب $${data.data.amount.toFixed(4)} لرصيدك` : `✅ $${data.data.amount.toFixed(4)} withdrawn to balance`)
        setShowWithdrawModal(false)
        fetchMiningData()
        fetchCurrentUser()
      } else {
        toast.error(data.error || 'Failed')
      }
    } catch (e) {
      toast.error('Network error')
    } finally {
      setWithdrawing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#00d4ff]" />
      </div>
    )
  }

  const accumulatedProfit = miningData?.accumulatedProfit || 0
  const canWithdraw = miningData?.canWithdraw
  const totalMiningDays = miningData?.totalMiningDays || 0

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {isRtl ? 'مركز التعدين' : 'Mining Center'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isRtl
            ? 'فعّل التعدين يومياً لكسب الأرباح. التعدين يدوم 24 ساعة ويجب إعادة تفعيله يومياً.'
            : 'Activate mining daily to earn profits. Mining lasts 24 hours and must be reactivated daily.'}
        </p>
      </motion.div>

      {/* Mining Status Card */}
      {hasActivePlan && user?.activePlan ? (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="relative overflow-hidden border-[#ffd700]/30">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/10 via-transparent to-[#9d4edd]/10" />
            <div className="relative p-6 md:p-8">
              {/* Plan info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ffd700] to-[#ff8c00] flex items-center justify-center text-2xl">
                    {user.activePlan.icon === 'gold' ? '🥇' : user.activePlan.icon === 'diamond' ? '💎' : user.activePlan.icon === 'silver' ? '🥈' : '🥉'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{isRtl ? user.activePlan.nameAr : user.activePlan.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={isMiningActive ? 'bg-emerald-500/20 text-emerald-600 border-0 gap-1' : 'bg-amber-500/20 text-amber-600 border-0 gap-1'}>
                        {isMiningActive ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{isRtl ? 'تعدين نشط' : 'Mining Active'}</> : <><Power className="h-3 w-3" />{isRtl ? 'تعدين متوقف' : 'Mining Stopped'}</>}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{user.activePlan.hashrate}</span>
                    </div>
                  </div>
                </div>

                {/* Auto-renew toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch checked={miningData?.autoRenew} onCheckedChange={handleToggleAutoRenew} />
                  <span className="text-sm font-medium">{isRtl ? 'تعدين تلقائي' : 'Auto Mining'}</span>
                </label>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="text-center p-3 rounded-xl glass">
                  <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'رأس المال (مقفل)' : 'Capital (Locked)'}</div>
                  <div className="text-lg font-bold">${user.activePlan.investment}</div>
                </div>
                <div className="text-center p-3 rounded-xl glass">
                  <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'الربح اليومي' : 'Daily Profit'}</div>
                  <div className="text-lg font-bold text-emerald-600">+${(user.activePlan.investment * user.activePlan.dailyProfit / 100).toFixed(2)}</div>
                </div>
                <div className="text-center p-3 rounded-xl glass">
                  <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'أرباح متراكمة' : 'Accumulated'}</div>
                  <div className="text-lg font-bold text-[#ffd700]">${accumulatedProfit.toFixed(4)}</div>
                </div>
                <div className="text-center p-3 rounded-xl glass">
                  <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'أيام التعدين' : 'Days Mined'}</div>
                  <div className="text-lg font-bold text-[#9d4edd]">{totalMiningDays}</div>
                </div>
              </div>

              {/* Mining session status */}
              {isMiningActive ? (
                <div className="space-y-4 mb-6">
                  {/* Live profit */}
                  <div className="p-4 rounded-2xl glass border-[#00d4ff]/20 bg-[#00d4ff]/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-[#00d4ff]" />
                        {isRtl ? 'الربح المباشر (هذه الجلسة)' : 'Live Profit (This Session)'}
                      </span>
                      <Badge className="bg-[#00d4ff]/20 text-[#00d4ff] border-0 gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
                        {isRtl ? 'مباشر' : 'Live'}
                      </Badge>
                    </div>
                    <div className="text-3xl font-black text-gradient-electric mb-1">
                      +${liveProfit.toFixed(6)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isRtl ? 'سيُضاف للأرباح المتراكمة عند انتهاء الجلسة' : 'Will be added to accumulated when session ends'}
                    </div>
                  </div>

                  {/* Countdown */}
                  <div className="p-4 rounded-2xl glass">
                    <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-[#9d4edd]" />
                      {isRtl ? 'الوقت المتبقي للتعدين' : 'Mining Time Remaining'}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#9d4edd]">{String(timeLeft.hours).padStart(2, '0')}</div>
                        <div className="text-[10px] text-muted-foreground">{isRtl ? 'ساعة' : 'Hours'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#9d4edd]">{String(timeLeft.minutes).padStart(2, '0')}</div>
                        <div className="text-[10px] text-muted-foreground">{isRtl ? 'دقيقة' : 'Minutes'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#9d4edd]">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        <div className="text-[10px] text-muted-foreground">{isRtl ? 'ثانية' : 'Seconds'}</div>
                      </div>
                    </div>
                    <Progress value={timeLeft.percent} className="h-2" />
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl glass border-amber-500/20 bg-amber-500/5 mb-6 text-center">
                  <Power className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                  <h3 className="font-bold mb-1">{isRtl ? 'التعدين متوقف' : 'Mining Stopped'}</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {miningData?.lastActivation
                      ? (isRtl ? 'انتهت جلسة التعدين السابقة. فعّل التعدين لكسب أرباح اليوم!' : 'Previous mining session ended. Activate mining to earn today!')
                      : (isRtl ? 'فعّل التعدين اليومي لبدء كسب الأرباح' : 'Activate daily mining to start earning')}
                  </p>
                  <Button
                    onClick={handleActivateMining}
                    disabled={activating === 'mining'}
                    className="bg-gradient-to-r from-[#ffd700] to-[#ff8c00] text-black border-0"
                  >
                    {activating === 'mining' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Power className="h-4 w-4 me-2" />{isRtl ? 'تفعيل التعدين (24 ساعة)' : 'Activate Mining (24h)'}</>}
                  </Button>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={!canWithdraw}
                  variant="outline"
                  className="flex-1 glass border-[#10b981]/30 hover:bg-[#10b981]/10"
                >
                  <Wallet className="h-4 w-4 me-2" />
                  {isRtl ? `سحب الأرباح ($${accumulatedProfit.toFixed(2)})` : `Withdraw Profits ($${accumulatedProfit.toFixed(2)})`}
                </Button>
                {isMiningActive && (
                  <div className="flex-1 text-center p-3 rounded-xl glass">
                    <div className="text-xs text-muted-foreground">{isRtl ? 'رأس المال يبقى مقفلاً حتى' : 'Capital locked until'}</div>
                    <div className="text-sm font-medium">{user.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString() : '-'}</div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="relative overflow-hidden border-[#9d4edd]/30 p-8 text-center">
            <div className="absolute -top-20 -end-20 w-80 h-80 rounded-full bg-[#9d4edd]/10 blur-3xl" />
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-[#9d4edd]/10 flex items-center justify-center mx-auto mb-4">
                <Cpu className="h-10 w-10 text-[#9d4edd]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{isRtl ? 'لا توجد خطة نشطة' : 'No Active Plan'}</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                {isRtl ? 'اختر خطة لبدء التعدين. رأس المال يبقى مقفلاً حتى نهاية الخطة، والأرباح يمكنك سحبها يومياً.' : 'Choose a plan to start mining. Capital stays locked until plan ends, profits can be withdrawn daily.'}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass">
                <span className="text-sm text-muted-foreground">{isRtl ? 'رصيدك' : 'Your balance'}:</span>
                <span className="text-lg font-bold text-[#ffd700]">${(user?.balance || 0).toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Available plans */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <h3 className="text-xl font-bold mb-4">{isRtl ? 'الخطط المتاحة' : 'Available Plans'}</h3>
        {plans.length === 0 ? (
          <Card className="p-8 text-center glass">
            <p className="text-sm text-muted-foreground">{isRtl ? 'لا توجد خطط' : 'No plans available'}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.filter(p => p.active).map((plan) => {
              const isCurrent = user?.activePlan?.id === plan.id
              const canAfford = (user?.balance || 0) >= plan.investment
              const totalExpected = plan.investment * plan.dailyProfit * plan.duration / 100
              return (
                <Card key={plan.id} className={`relative overflow-hidden transition-all hover:border-foreground/20 ${isCurrent ? 'border-[#ffd700]/40' : 'border-border'}`}>
                  <div className={`h-1.5 w-full bg-gradient-to-r ${plan.gradient}`} />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold">{isRtl ? plan.nameAr : plan.name}</h4>
                      {isCurrent ? <Badge className="bg-[#ffd700]/20 text-[#ffd700] border-0">{isRtl ? 'نشط' : 'Active'}</Badge> : <span className="text-2xl">{plan.icon === 'gold' ? '🥇' : plan.icon === 'diamond' ? '💎' : plan.icon === 'silver' ? '🥈' : '🥉'}</span>}
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">{isRtl ? 'الاستثمار' : 'Investment'}</span><span className="font-semibold">${plan.investment}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{isRtl ? 'يومي' : 'Daily'}</span><span className="font-semibold text-emerald-600">{plan.dailyProfit}%</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">{isRtl ? 'المدة' : 'Duration'}</span><span className="font-semibold">{plan.duration} {isRtl ? 'يوم' : 'days'}</span></div>
                    </div>
                    <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">{isRtl ? 'إجمالي الأرباح' : 'Total Profit'}</span>
                        <span className="text-sm font-black text-emerald-600">+${totalExpected.toFixed(2)}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">{plan.dailyProfit}% × {plan.duration} {isRtl ? 'يوم' : 'days'} = {(plan.dailyProfit * plan.duration).toFixed(0)}%</div>
                    </div>
                    {!isCurrent && (
                      <Button size="sm" className={`w-full mt-4 bg-gradient-to-r ${plan.gradient} text-white border-0`} disabled={!canAfford || activating === plan.id} onClick={() => handleActivatePlan(plan.id)}>
                        {activating === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : !canAfford ? (isRtl ? 'رصيد غير كافٍ' : 'Insufficient') : (isRtl ? 'تفعيل' : 'Activate')}
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Withdraw Profits Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !withdrawing && setShowWithdrawModal(false)} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()} className="relative w-full max-w-md">
              <div className="glass rounded-3xl border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">{isRtl ? 'سحب أرباح التعدين' : 'Withdraw Mining Profits'}</h3>
                  <button onClick={() => !withdrawing && setShowWithdrawModal(false)} className="w-9 h-9 rounded-full glass flex items-center justify-center"><X className="h-4 w-4" /></button>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#10b981]/10 to-[#ffd700]/10 border border-[#10b981]/20 mb-6 text-center">
                  <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'الأرباح المتراكمة' : 'Accumulated Profits'}</div>
                  <div className="text-4xl font-black text-gradient-electric">${accumulatedProfit.toFixed(4)}</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">{isRtl ? 'سيتم نقل الأرباح لرصيدك القابل للسحب. رأس المال يبقى مقفلاً حتى نهاية الخطة.' : 'Profits will be moved to your balance. Capital stays locked until plan ends.'}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 glass" onClick={() => setShowWithdrawModal(false)} disabled={withdrawing}>{isRtl ? 'إلغاء' : 'Cancel'}</Button>
                  <Button onClick={handleWithdrawProfits} disabled={withdrawing} className="flex-1 bg-gradient-to-r from-[#10b981] to-[#ffd700] text-white border-0">
                    {withdrawing ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4 me-2" />{isRtl ? 'تأكيد السحب' : 'Confirm'}</>}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
