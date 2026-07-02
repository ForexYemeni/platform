'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cpu, Clock, TrendingUp, RefreshCw, Crown, Activity, Zap } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useAppStore } from '@/lib/store'
import { miningPlans, miningChartData } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

export function MiningPage() {
  const { lang, setAuthStage, user } = useAppStore()
  const isRtl = lang === 'ar'
  const [selectedPlan, setSelectedPlan] = useState('gold')
  const [liveProfit, setLiveProfit] = useState(20.0)
  const [timeLeft, setTimeLeft] = useState({ days: 42, hours: 18, minutes: 32, seconds: 45 })

  useEffect(() => {
    const profitInterval = setInterval(() => {
      setLiveProfit(p => p + Math.random() * 0.0005)
    }, 2000)

    const timeInterval = setInterval(() => {
      setTimeLeft(t => {
        let { days, hours, minutes, seconds } = t
        seconds--
        if (seconds < 0) { seconds = 59; minutes-- }
        if (minutes < 0) { minutes = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => {
      clearInterval(profitInterval)
      clearInterval(timeInterval)
    }
  }, [])

  const activePlan = miningPlans.find(p => p.id === selectedPlan) || miningPlans[2]

  const handleActivate = (planId: string) => {
    if (!user) {
      setAuthStage('register')
      return
    }
    setSelectedPlan(planId)
    toast.success(isRtl ? 'تم تفعيل الخطة!' : 'Plan activated!')
  }

  const handleReinvest = () => {
    toast.success(isRtl ? 'تمت إعادة استثمار أرباحك!' : 'Profits reinvested!')
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

      {/* Active plan hero */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="relative overflow-hidden border-[#ffd700]/30">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/10 via-transparent to-[#9d4edd]/10" />
          <div className="absolute -top-20 -end-20 w-80 h-80 rounded-full bg-[#ffd700]/10 blur-3xl" />
          <div className="absolute -bottom-20 -start-20 w-80 h-80 rounded-full bg-[#9d4edd]/10 blur-3xl" />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ffd700] to-[#ff8c00] flex items-center justify-center text-2xl">
                    🥇
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {isRtl ? 'الخطة الذهبية' : 'Gold Plan'}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {isRtl ? 'تعدين نشط' : 'Mining Active'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">5.0 TH/s</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 rounded-xl glass">
                  <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'الاستثمار' : 'Invested'}</div>
                  <div className="text-lg font-bold">$500</div>
                </div>
                <div className="text-center p-3 rounded-xl glass">
                  <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'الربح اليومي' : 'Daily'}</div>
                  <div className="text-lg font-bold text-emerald-400">+4%</div>
                </div>
                <div className="text-center p-3 rounded-xl glass">
                  <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'إجمالي الربح' : 'Earned'}</div>
                  <div className="text-lg font-bold text-[#ffd700]">$540</div>
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
                  {isRtl ? 'يُحدّث كل 2 ثانية' : 'Updates every 2s'}
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
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isRtl ? 'تقدم الخطة' : 'Plan Progress'}</span>
                <span className="font-semibold">30% (18/60 {isRtl ? 'يوم' : 'days'})</span>
              </div>
              <Progress value={30} className="h-3" />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleReinvest}
                className="flex-1 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0"
              >
                <RefreshCw className="h-4 w-4 me-2" />
                {isRtl ? 'إعادة استثمار الأرباح' : 'Reinvest Profits'}
              </Button>
              <Button variant="outline" className="flex-1 glass">
                <TrendingUp className="h-4 w-4 me-2" />
                {isRtl ? 'ترقية الخطة' : 'Upgrade Plan'}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Hashrate chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-5 glass border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold">{isRtl ? 'معدل التعدين (24 ساعة)' : 'Mining Hashrate (24h)'}</h3>
              <p className="text-xs text-muted-foreground">{isRtl ? 'معدل TH/s على مدار اليوم' : 'TH/s rate throughout the day'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#9d4edd]/10 text-[#9d4edd] border-0">Avg: 145.32 TH/s</Badge>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-0">Peak: 156.8 TH/s</Badge>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={miningChartData}>
              <defs>
                <linearGradient id="colorHash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9d4edd" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#9d4edd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} interval={3} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(20,20,35,0.95)',
                  border: '1px solid rgba(157,78,221,0.3)',
                  borderRadius: '12px',
                }}
              />
              <Area type="monotone" dataKey="hashrate" stroke="#9d4edd" strokeWidth={2} fill="url(#colorHash)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* All plans */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-bold mb-4">{isRtl ? 'كل الخطط' : 'All Plans'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {miningPlans.map((plan) => {
            const isActive = plan.id === 'gold'
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden cursor-pointer transition-all hover:border-white/20 ${
                  isActive ? 'border-[#ffd700]/40 glow-gold' : 'border-white/5'
                }`}
                onClick={() => handleActivate(plan.id)}
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${plan.gradient}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold">
                      {isRtl
                        ? { basic: 'الأساسية', silver: 'الفضية', gold: 'الذهبية', diamond: 'الماسية' }[plan.id]
                        : plan.nameKey.charAt(0).toUpperCase() + plan.nameKey.slice(1)}
                    </h4>
                    {isActive ? (
                      <Badge className="bg-[#ffd700]/20 text-[#ffd700] border-0">{isRtl ? 'نشط' : 'Active'}</Badge>
                    ) : (
                      <span className="text-2xl">
                        {plan.id === 'basic' && '🥉'}
                        {plan.id === 'silver' && '🥈'}
                        {plan.id === 'gold' && '🥇'}
                        {plan.id === 'diamond' && '💎'}
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
                  {!isActive && (
                    <Button
                      size="sm"
                      className={`w-full mt-4 bg-gradient-to-r ${plan.gradient} text-white border-0`}
                      onClick={(e) => { e.stopPropagation(); handleActivate(plan.id) }}
                    >
                      {isRtl ? 'تفعيل' : 'Activate'}
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
