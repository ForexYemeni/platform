'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Wallet, TrendingUp, TrendingDown, Users, Cpu, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Sparkles, Activity, Zap, Crown
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts'
import { useAppStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function DashboardOverview() {
  const { lang, user, setView } = useAppStore()
  const isRtl = lang === 'ar'
  const [liveProfit, setLiveProfit] = useState(user?.dailyProfit || 0)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch real dashboard data
  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/dashboard')
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setDashboardData(data.data)
        }
      }
    } catch (e) {
      console.error('Dashboard fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  // Only show live profit counter if user has an active plan
  useEffect(() => {
    if (!user?.dailyProfit || user.dailyProfit <= 0) {
      setLiveProfit(0)
      return
    }
    const interval = setInterval(() => {
      setLiveProfit(p => p + Math.random() * 0.001)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const hasActivePlan = dashboardData?.user?.isMiningActive || (user?.activePlan && user?.planExpiresAt && new Date(user.planExpiresAt) > new Date())

  const stats = [
    {
      label: isRtl ? 'الرصيد الحالي' : 'Current Balance',
      value: `$${(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: user?.balance > 0 ? '+0%' : '0%',
      positive: true,
      icon: Wallet,
      color: '#00d4ff',
      bg: 'from-[#00d4ff]/20 to-[#00d4ff]/5',
    },
    {
      label: isRtl ? 'إجمالي الأرباح' : 'Total Profit',
      value: `$${(user?.totalProfit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: user?.totalProfit > 0 ? '+0%' : '0%',
      positive: true,
      icon: TrendingUp,
      color: '#10b981',
      bg: 'from-[#10b981]/20 to-[#10b981]/5',
    },
    {
      label: isRtl ? 'الأرباح اليومية' : 'Daily Profit',
      value: hasActivePlan ? `$${liveProfit.toFixed(4)}` : '$0.00',
      change: hasActivePlan ? (isRtl ? 'مباشر' : 'Live') : (isRtl ? 'لا يوجد تعدين' : 'No mining'),
      positive: hasActivePlan,
      icon: Zap,
      color: '#ffd700',
      bg: 'from-[#ffd700]/20 to-[#ffd700]/5',
      live: hasActivePlan,
    },
    {
      label: isRtl ? 'الأرباح الشهرية' : 'Monthly Profit',
      value: `$${(user?.monthlyProfit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: user?.monthlyProfit > 0 ? '+0%' : '0%',
      positive: true,
      icon: Activity,
      color: '#9d4edd',
      bg: 'from-[#9d4edd]/20 to-[#9d4edd]/5',
    },
  ]

  const secondaryStats = [
    { label: isRtl ? 'عدد الإحالات' : 'Referrals', value: dashboardData?.user?.referrals || 0, icon: Users, color: '#00d4ff' },
    { label: isRtl ? 'حالة التعدين' : 'Mining Status', value: hasActivePlan ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'متوقف' : 'Inactive'), icon: Cpu, color: hasActivePlan ? '#10b981' : '#6b7280' },
    { label: isRtl ? 'المهام المكتملة' : 'Tasks Done', value: dashboardData?.stats?.completedTasks || 0, icon: CheckCircle2, color: '#ffd700' },
    { label: isRtl ? 'مستوى VIP' : 'VIP Level', value: user?.vipLevel || 1, icon: Crown, color: '#9d4edd' },
  ]

  // Build chart data from real transactions (last 30 days)
  const realTransactions = dashboardData?.recentTransactions || []
  const chartData = (() => {
    const days: { day: string; profit: number; date: string }[] = []
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayProfit = realTransactions
        .filter((t: any) => {
          const tDate = new Date(t.createdAt).toISOString().split('T')[0]
          return tDate === dateStr && (t.type === 'PROFIT' || t.type === 'TASK_REWARD' || t.type === 'BONUS' || t.type === 'REFERRAL')
        })
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)
      days.push({
        day: `Day ${30 - i}`,
        profit: dayProfit,
        date: dateStr,
      })
    }
    return days
  })()

  const hasChartData = chartData.some(d => d.profit > 0)

  const txTypeLabels: Record<string, { ar: string; en: string }> = {
    deposit: { ar: 'إيداع', en: 'Deposit' },
    withdrawal: { ar: 'سحب', en: 'Withdrawal' },
    profit: { ar: 'ربح', en: 'Profit' },
    referral: { ar: 'عمولة إحالة', en: 'Referral' },
    task: { ar: 'مكافأة مهمة', en: 'Task Reward' },
    bonus: { ar: 'مكافأة', en: 'Bonus' },
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Welcome header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {isRtl ? 'مرحباً، ' : 'Welcome back, '}
            <span className="text-gradient-electric">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isRtl ? 'إليك ملخص أداء استثماراتك اليوم' : "Here's your investment performance today"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setView('deposits')} className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0">
            <ArrowDownRight className="h-4 w-4 me-2" />
            {isRtl ? 'إيداع' : 'Deposit'}
          </Button>
          <Button variant="outline" onClick={() => setView('withdrawals')} className="glass">
            <ArrowUpRight className="h-4 w-4 me-2" />
            {isRtl ? 'سحب' : 'Withdraw'}
          </Button>
        </div>
      </motion.div>

      {/* Main stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`relative overflow-hidden border-white/5 bg-gradient-to-br ${stat.bg} hover:border-white/10 transition-all`}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${stat.color}30`, border: `1px solid ${stat.color}40` }}
                  >
                    <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                  {stat.live ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0 gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {isRtl ? 'مباشر' : 'Live'}
                    </Badge>
                  ) : (
                    <Badge className={`${stat.positive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} border-0`}>
                      {stat.change}
                    </Badge>
                  )}
                </div>
                <div className="text-2xl font-black mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {secondaryStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 + 0.2 }}
          >
            <Card className="p-4 glass border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${stat.color}20` }}
                >
                  <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{stat.label}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profit chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="p-5 glass border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">{isRtl ? 'رسم الأرباح اليومية' : 'Daily Profit Chart'}</h3>
                <p className="text-xs text-muted-foreground">{isRtl ? 'آخر 30 يوم' : 'Last 30 days'}</p>
              </div>
              <Badge className="bg-[#00d4ff]/10 text-[#00d4ff] border-0">
                {hasChartData ? (isRtl ? 'بيانات حقيقية' : 'Real data') : (isRtl ? 'لا توجد أرباح' : 'No profits')}
              </Badge>
            </div>
            {hasChartData ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} interval={5} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(20,20,35,0.95)',
                    border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="profit" stroke="#00d4ff" strokeWidth={2} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                  <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {isRtl ? 'لا توجد أرباح بعد' : 'No profits yet'}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {isRtl ? 'فعّل خطة تعدين لتبدأ بكسب الأرباح' : 'Activate a mining plan to start earning'}
                </p>
                <Button
                  size="sm"
                  className="mt-4 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0"
                  onClick={() => setView('mining')}
                >
                  {isRtl ? 'استكشف الخطط' : 'Explore Plans'}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Mining hashrate */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5 glass border-white/5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">{isRtl ? 'قوة التعدين' : 'Mining Hashrate'}</h3>
                <p className="text-xs text-muted-foreground">{isRtl ? 'حالتك الحالية' : 'Your current status'}</p>
              </div>
              <Cpu className="h-4 w-4 text-[#9d4edd]" />
            </div>
            {hasActivePlan && user?.activePlan ? (
              <>
                <div className="text-3xl font-black text-gradient-electric mb-2">
                  {user.activePlan.hashrate}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0 gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isRtl ? 'يعمل' : 'Online'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {user.activePlan.dailyProfit}% {isRtl ? 'يومي' : 'daily'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl glass text-center">
                    <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'الاستثمار' : 'Investment'}</div>
                    <div className="text-lg font-bold">${user.activePlan.investment}</div>
                  </div>
                  <div className="p-3 rounded-xl glass text-center">
                    <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'المدة' : 'Duration'}</div>
                    <div className="text-lg font-bold">{user.activePlan.duration} {isRtl ? 'يوم' : 'days'}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-[#9d4edd]/10 flex items-center justify-center mx-auto mb-3">
                  <Cpu className="h-7 w-7 text-[#9d4edd]" />
                </div>
                <div className="text-3xl font-black text-muted-foreground mb-2">0 TH/s</div>
                <Badge className="bg-muted/20 text-muted-foreground border-0 mb-3">
                  {isRtl ? 'متوقف' : 'Offline'}
                </Badge>
                <p className="text-xs text-muted-foreground mb-4">
                  {isRtl ? 'فعّل خطة تعدين لتبدأ' : 'Activate a mining plan to start'}
                </p>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0"
                  onClick={() => setView('mining')}
                >
                  {isRtl ? 'ابدأ التعدين' : 'Start Mining'}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Active plan + recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active mining plan */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-5 glass border-[#ffd700]/20 bg-gradient-to-br from-[#ffd700]/10 to-transparent h-full">
            {hasActivePlan && user?.activePlan ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-[#ffd700]" />
                    <span className="font-bold">
                      {isRtl ? user.activePlan.nameAr : user.activePlan.name}
                    </span>
                  </div>
                  <Badge className="bg-[#ffd700]/20 text-[#ffd700] border-0">
                    {isRtl ? 'نشط' : 'Active'}
                  </Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isRtl ? 'الاستثمار' : 'Investment'}</span>
                    <span className="font-semibold">${user.activePlan.investment}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isRtl ? 'الربح اليومي' : 'Daily Profit'}</span>
                    <span className="font-semibold text-emerald-400">
                      +{user.activePlan.dailyProfit}% (${(user.activePlan.investment * user.activePlan.dailyProfit / 100).toFixed(2)})
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isRtl ? 'المتبقي' : 'Remaining'}</span>
                    <span className="font-semibold">
                      {user.planExpiresAt
                        ? Math.max(0, Math.ceil((new Date(user.planExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                        : 0} {isRtl ? 'يوم' : 'days'}
                    </span>
                  </div>
                </div>
                {user.planActivatedAt && user.planExpiresAt && (
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{isRtl ? 'التقدم' : 'Progress'}</span>
                      <span>
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
                      className="h-2"
                    />
                  </div>
                )}
                <Button
                  onClick={() => setView('mining')}
                  variant="outline"
                  size="sm"
                  className="w-full glass border-[#ffd700]/30 hover:bg-[#ffd700]/10"
                >
                  {isRtl ? 'عرض التفاصيل' : 'View Details'}
                </Button>
              </>
            ) : (
              // No active plan - prompt user to activate one
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-[#ffd700]/10 flex items-center justify-center mx-auto mb-3">
                  <Crown className="h-7 w-7 text-[#ffd700]" />
                </div>
                <h3 className="font-bold mb-1">
                  {isRtl ? 'لا توجد خطة نشطة' : 'No Active Plan'}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {isRtl
                    ? 'اختر خطة تعدين لتبدأ بكسب الأرباح اليومية'
                    : 'Choose a mining plan to start earning daily profits'}
                </p>
                <Button
                  onClick={() => setView('mining')}
                  size="sm"
                  className="w-full bg-gradient-to-r from-[#ffd700] to-[#ff8c00] text-black border-0"
                >
                  {isRtl ? 'استكشف الخطط' : 'Explore Plans'}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent transactions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="p-5 glass border-white/5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{isRtl ? 'آخر العمليات' : 'Recent Transactions'}</h3>
              <Button variant="ghost" size="sm" onClick={() => setView('deposits')}>
                {isRtl ? 'عرض الكل' : 'View All'}
              </Button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-luxury">
              {(dashboardData?.recentTransactions || []).length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {isRtl ? 'لا توجد عمليات بعد' : 'No transactions yet'}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {isRtl ? 'ابدأ بإيداع الأموال' : 'Start by depositing funds'}
                  </p>
                </div>
              ) : (dashboardData?.recentTransactions || []).slice(0, 6).map((tx: any) => {
                const isIncome = tx.type === 'DEPOSIT' || tx.type === 'PROFIT' || tx.type === 'REFERRAL' || tx.type === 'TASK_REWARD' || tx.type === 'BONUS'
                const typeLabel = txTypeLabels[tx.type.toLowerCase()] || txTypeLabels['deposit']
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/30 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isIncome ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {tx.type === 'DEPOSIT' && <ArrowDownRight className="h-4 w-4" />}
                      {tx.type === 'WITHDRAWAL' && <ArrowUpRight className="h-4 w-4" />}
                      {tx.type === 'PROFIT' && <TrendingUp className="h-4 w-4" />}
                      {tx.type === 'REFERRAL' && <Users className="h-4 w-4" />}
                      {tx.type === 'TASK_REWARD' && <CheckCircle2 className="h-4 w-4" />}
                      {tx.type === 'BONUS' && <Sparkles className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">
                        {isRtl ? typeLabel.ar : typeLabel.en}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className={`text-sm font-bold ${!isIncome ? 'text-red-400' : 'text-emerald-400'}`}>
                        {!isIncome ? '-' : '+'}{tx.amount} {tx.currency}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] mt-0.5 ${
                          tx.status === 'COMPLETED' ? 'border-emerald-500/30 text-emerald-400' :
                          tx.status === 'PENDING' ? 'border-amber-500/30 text-amber-400' :
                          'border-red-500/30 text-red-400'
                        }`}
                      >
                        {tx.status === 'COMPLETED' ? (isRtl ? 'مكتمل' : 'Completed') :
                         tx.status === 'PENDING' ? (isRtl ? 'معلق' : 'Pending') :
                         (isRtl ? 'مرفوض' : 'Rejected')}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
