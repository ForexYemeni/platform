'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Wallet, TrendingUp, TrendingDown, Users, Cpu, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Sparkles, Activity, Zap, Crown
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts'
import { useAppStore } from '@/lib/store'
import { profitChartData, miningChartData, mockTransactions } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function DashboardOverview() {
  const { lang, user, setView } = useAppStore()
  const isRtl = lang === 'ar'
  const [liveProfit, setLiveProfit] = useState(20.0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveProfit(p => p + Math.random() * 0.001)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      label: isRtl ? 'الرصيد الحالي' : 'Current Balance',
      value: `$${(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+12.5%',
      positive: true,
      icon: Wallet,
      color: '#00d4ff',
      bg: 'from-[#00d4ff]/20 to-[#00d4ff]/5',
    },
    {
      label: isRtl ? 'إجمالي الأرباح' : 'Total Profit',
      value: `$${(user?.totalProfit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+8.2%',
      positive: true,
      icon: TrendingUp,
      color: '#10b981',
      bg: 'from-[#10b981]/20 to-[#10b981]/5',
    },
    {
      label: isRtl ? 'الأرباح اليومية' : 'Daily Profit',
      value: `$${liveProfit.toFixed(4)}`,
      change: isRtl ? 'مباشر' : 'Live',
      positive: true,
      icon: Zap,
      color: '#ffd700',
      bg: 'from-[#ffd700]/20 to-[#ffd700]/5',
      live: true,
    },
    {
      label: isRtl ? 'الأرباح الشهرية' : 'Monthly Profit',
      value: `$${(user?.monthlyProfit || 0).toLocaleString()}`,
      change: '+24.1%',
      positive: true,
      icon: Activity,
      color: '#9d4edd',
      bg: 'from-[#9d4edd]/20 to-[#9d4edd]/5',
    },
  ]

  const secondaryStats = [
    { label: isRtl ? 'عدد الإحالات' : 'Referrals', value: user?.referrals || 0, icon: Users, color: '#00d4ff' },
    { label: isRtl ? 'حالة التعدين' : 'Mining Status', value: isRtl ? 'نشط' : 'Active', icon: Cpu, color: '#10b981' },
    { label: isRtl ? 'المهام المكتملة' : 'Tasks Done', value: '5/8', icon: CheckCircle2, color: '#ffd700' },
    { label: isRtl ? 'مستوى VIP' : 'VIP Level', value: user?.vipLevel || 1, icon: Crown, color: '#9d4edd' },
  ]

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
              <Badge className="bg-[#00d4ff]/10 text-[#00d4ff] border-0">+{profitChartData.length} {isRtl ? 'يوم' : 'days'}</Badge>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={profitChartData}>
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
                <p className="text-xs text-muted-foreground">{isRtl ? 'آخر 24 ساعة' : 'Last 24 hours'}</p>
              </div>
              <Cpu className="h-4 w-4 text-[#9d4edd]" />
            </div>
            <div className="text-3xl font-black text-gradient-electric mb-2">145.32 TH/s</div>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isRtl ? 'يعمل' : 'Online'}
              </Badge>
              <span className="text-xs text-muted-foreground">99.98% {isRtl ? 'وقت التشغيل' : 'uptime'}</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={miningChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} interval={3} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(20,20,35,0.95)',
                    border: '1px solid rgba(157,78,221,0.3)',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="hashrate" fill="#9d4edd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-[#ffd700]" />
                <span className="font-bold">{isRtl ? 'الخطة الذهبية' : 'Gold Plan'}</span>
              </div>
              <Badge className="bg-[#ffd700]/20 text-[#ffd700] border-0">{isRtl ? 'نشط' : 'Active'}</Badge>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isRtl ? 'الاستثمار' : 'Investment'}</span>
                <span className="font-semibold">$500.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isRtl ? 'الربح اليومي' : 'Daily Profit'}</span>
                <span className="font-semibold text-emerald-400">+4% ($20.00)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isRtl ? 'المتبقي' : 'Remaining'}</span>
                <span className="font-semibold">42 {isRtl ? 'يوم' : 'days'}</span>
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{isRtl ? 'التقدم' : 'Progress'}</span>
                <span>30%</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <Button
              onClick={() => setView('mining')}
              variant="outline"
              size="sm"
              className="w-full glass border-[#ffd700]/30 hover:bg-[#ffd700]/10"
            >
              {isRtl ? 'عرض التفاصيل' : 'View Details'}
            </Button>
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
              {mockTransactions.slice(0, 6).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/30 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'deposit' || tx.type === 'profit' || tx.type === 'referral' || tx.type === 'task' || tx.type === 'bonus'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-red-500/15 text-red-400'
                    }`}
                  >
                    {tx.type === 'deposit' && <ArrowDownRight className="h-4 w-4" />}
                    {tx.type === 'withdrawal' && <ArrowUpRight className="h-4 w-4" />}
                    {tx.type === 'profit' && <TrendingUp className="h-4 w-4" />}
                    {tx.type === 'referral' && <Users className="h-4 w-4" />}
                    {tx.type === 'task' && <CheckCircle2 className="h-4 w-4" />}
                    {tx.type === 'bonus' && <Sparkles className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {isRtl ? txTypeLabels[tx.type].ar : txTypeLabels[tx.type].en}
                    </div>
                    <div className="text-xs text-muted-foreground">{tx.date}</div>
                  </div>
                  <div className="text-end">
                    <div className={`text-sm font-bold ${tx.type === 'withdrawal' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}{tx.amount} {tx.currency}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] mt-0.5 ${
                        tx.status === 'completed' ? 'border-emerald-500/30 text-emerald-400' :
                        tx.status === 'pending' ? 'border-amber-500/30 text-amber-400' :
                        'border-red-500/30 text-red-400'
                      }`}
                    >
                      {tx.status === 'completed' ? (isRtl ? 'مكتمل' : 'Completed') :
                       tx.status === 'pending' ? (isRtl ? 'معلق' : 'Pending') :
                       (isRtl ? 'مرفوض' : 'Rejected')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
