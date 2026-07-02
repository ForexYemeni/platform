'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Users, DollarSign, TrendingUp, TrendingDown, Search, MoreHorizontal,
  Shield, CheckCircle2, XCircle, Clock, Ban, Edit, Send, Plus,
  Cpu, CreditCard, CheckSquare, Settings, Activity, Crown, AlertCircle, Save
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { useAppStore } from '@/lib/store'
import { mockAdminUsers, adminRevenueData, userGrowthData, miningPlans } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export function AdminPanel() {
  const { lang, setView } = useAppStore()
  const isRtl = lang === 'ar'
  const [search, setSearch] = useState('')

  const stats = [
    { label: isRtl ? 'إجمالي المستخدمين' : 'Total Users', value: '247,832', change: '+8.2%', icon: Users, color: '#00d4ff' },
    { label: isRtl ? 'المستخدمون النشطون' : 'Active Users', value: '184,219', change: '+12.5%', icon: Activity, color: '#10b981' },
    { label: isRtl ? 'إجمالي الإيرادات' : 'Total Revenue', value: '$2.4M', change: '+24.1%', icon: DollarSign, color: '#ffd700' },
    { label: isRtl ? 'إجمالي الإيداعات' : 'Total Deposits', value: '$8.7M', change: '+18.4%', icon: TrendingUp, color: '#9d4edd' },
    { label: isRtl ? 'إجمالي السحوبات' : 'Total Withdrawals', value: '$3.2M', change: '+9.8%', icon: TrendingDown, color: '#ef4444' },
    { label: isRtl ? 'مستخدمون جدد (اليوم)' : 'New Today', value: '+1,243', change: '+15.3%', icon: Crown, color: '#06b6d4' },
  ]

  const pendingDeposits = [
    { user: 'Ahmed Hassan', amount: 0.005, currency: 'BTC', value: '$339.25', time: '5 min ago', status: 'pending' },
    { user: 'Sara Al-R', amount: 500, currency: 'USDT', value: '$500.00', time: '15 min ago', status: 'pending' },
    { user: 'John Smith', amount: 1.5, currency: 'ETH', value: '$5,280.27', time: '30 min ago', status: 'pending' },
  ]

  const pendingWithdrawals = [
    { user: 'Mei Lin', amount: 1200, currency: 'USDT', value: '$1,200.00', time: '2 min ago', status: 'pending' },
    { user: 'David Kim', amount: 0.008, currency: 'BTC', value: '$542.80', time: '20 min ago', status: 'pending' },
    { user: 'Fatima N.', amount: 250, currency: 'USDT', value: '$250.00', time: '45 min ago', status: 'pending' },
  ]

  const filteredUsers = mockAdminUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const pieData = [
    { name: 'Basic', value: 45200, color: '#10b981' },
    { name: 'Silver', value: 32100, color: '#94a3b8' },
    { name: 'Gold', value: 28400, color: '#ffd700' },
    { name: 'Diamond', value: 12500, color: '#9d4edd' },
  ]

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-6 w-6 text-[#ffd700]" />
            <h1 className="text-2xl md:text-3xl font-bold">
              {isRtl ? 'لوحة الإدارة' : 'Admin Panel'}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {isRtl ? 'إدارة المنصة والمستخدمين والمدفوعات' : 'Manage platform, users and payments'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0 gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {isRtl ? 'الأنظمة تعمل' : 'Systems Online'}
          </Badge>
          <Button
            onClick={() => setView('dashboard')}
            variant="outline"
            className="glass"
          >
            {isRtl ? 'العودة' : 'Back'}
          </Button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-4 glass border-white/5 hover:border-white/10 transition-all">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${stat.color}20` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div className="text-xl font-black">{stat.value}</div>
              <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-emerald-400">{stat.change}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="p-5 glass border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{isRtl ? 'الإيرادات الشهرية' : 'Monthly Revenue'}</h3>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0">+24.1%</Badge>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={adminRevenueData}>
                <defs>
                  <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffd700" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ffd700" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="deposits" stroke="#00d4ff" strokeWidth={2} fill="url(#colorDep)" />
                <Area type="monotone" dataKey="withdrawals" stroke="#ef4444" strokeWidth={2} fill="url(#colorWd)" />
                <Area type="monotone" dataKey="profit" stroke="#ffd700" strokeWidth={2} fill="url(#colorPf)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5 glass border-white/5 h-full">
            <h3 className="font-bold mb-4">{isRtl ? 'توزيع الخطط' : 'Plan Distribution'}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {pieData.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="text-muted-foreground">{p.name}</span>
                  <span className="font-medium ms-auto">{(p.value / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Management tabs */}
      <Tabs defaultValue="users">
        <TabsList className="glass overflow-x-auto no-scrollbar">
          <TabsTrigger value="users"><Users className="h-4 w-4 me-2" />{isRtl ? 'المستخدمون' : 'Users'}</TabsTrigger>
          <TabsTrigger value="payments"><CreditCard className="h-4 w-4 me-2" />{isRtl ? 'المدفوعات' : 'Payments'}</TabsTrigger>
          <TabsTrigger value="plans"><Cpu className="h-4 w-4 me-2" />{isRtl ? 'الخطط' : 'Plans'}</TabsTrigger>
          <TabsTrigger value="tasks"><CheckSquare className="h-4 w-4 me-2" />{isRtl ? 'المهام' : 'Tasks'}</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="h-4 w-4 me-2" />{isRtl ? 'الإعدادات' : 'Settings'}</TabsTrigger>
        </TabsList>

        {/* Users management */}
        <TabsContent value="users" className="space-y-4">
          <Card className="p-5 glass border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <h3 className="font-bold">{isRtl ? 'إدارة المستخدمين' : 'User Management'}</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={isRtl ? 'بحث...' : 'Search...'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="ps-10 bg-white/5 w-full sm:w-64"
                  />
                </div>
                <Button variant="outline" className="glass" onClick={() => toast.success(isRtl ? 'تم إرسال الرسالة' : 'Message sent')}>
                  <Send className="h-4 w-4 me-2" />
                  <span className="hidden sm:inline">{isRtl ? 'رسالة جماعية' : 'Broadcast'}</span>
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-luxury">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="text-start font-medium pb-3 ps-2">{isRtl ? 'المستخدم' : 'User'}</th>
                    <th className="text-start font-medium pb-3 hidden md:table-cell">{isRtl ? 'الرصيد' : 'Balance'}</th>
                    <th className="text-start font-medium pb-3 hidden lg:table-cell">{isRtl ? 'الاستثمار' : 'Invested'}</th>
                    <th className="text-start font-medium pb-3 hidden md:table-cell">{isRtl ? 'الخطة' : 'Plan'}</th>
                    <th className="text-start font-medium pb-3 hidden lg:table-cell">{isRtl ? 'آخر نشاط' : 'Last Active'}</th>
                    <th className="text-start font-medium pb-3">{isRtl ? 'الحالة' : 'Status'}</th>
                    <th className="text-start font-medium pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 ps-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-9 h-9 bg-gradient-to-br from-[#00d4ff] to-[#9d4edd]">
                            <AvatarFallback className="text-white text-xs font-bold">
                              {u.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{u.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-semibold hidden md:table-cell">${u.balance.toFixed(2)}</td>
                      <td className="py-3 hidden lg:table-cell text-muted-foreground">${u.totalInvested}</td>
                      <td className="py-3 hidden md:table-cell">
                        <Badge variant="outline" className="border-white/10">{u.plan}</Badge>
                      </td>
                      <td className="py-3 hidden lg:table-cell text-muted-foreground text-xs">{u.lastActive}</td>
                      <td className="py-3">
                        <Badge
                          className={
                            u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-0' :
                            u.status === 'blocked' ? 'bg-red-500/20 text-red-400 border-0' :
                            'bg-amber-500/20 text-amber-400 border-0'
                          }
                        >
                          {u.status === 'active' ? (isRtl ? 'نشط' : 'Active') :
                           u.status === 'blocked' ? (isRtl ? 'محظور' : 'Blocked') :
                           (isRtl ? 'معلق' : 'Pending')}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toast.success(isRtl ? 'تم تعديل الرصيد' : 'Balance edited')}
                            className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center"
                            title={isRtl ? 'تعديل الرصيد' : 'Edit Balance'}
                          >
                            <Edit className="h-3.5 w-3.5 text-[#00d4ff]" />
                          </button>
                          <button
                            onClick={() => toast.success(isRtl ? (u.status === 'blocked' ? 'تم إلغاء الحظر' : 'تم الحظر') : u.status === 'blocked' ? 'Unblocked' : 'Blocked')}
                            className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center"
                            title={isRtl ? (u.status === 'blocked' ? 'إلغاء الحظر' : 'حظر') : (u.status === 'blocked' ? 'Unblock' : 'Block')}
                          >
                            {u.status === 'blocked' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Ban className="h-3.5 w-3.5 text-red-400" />}
                          </button>
                          <button className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pending deposits */}
            <Card className="p-5 glass border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#00d4ff]" />
                  {isRtl ? 'إيداعات معلقة' : 'Pending Deposits'}
                </h3>
                <Badge className="bg-amber-500/20 text-amber-400 border-0">{pendingDeposits.length}</Badge>
              </div>
              <div className="space-y-2">
                {pendingDeposits.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass">
                    <div className="w-9 h-9 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-[#00d4ff]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{d.user}</div>
                      <div className="text-xs text-muted-foreground">{d.amount} {d.currency} • {d.time}</div>
                    </div>
                    <div className="text-end">
                      <div className="text-sm font-bold">{d.value}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => toast.success(isRtl ? 'تم القبول' : 'Approved')}
                        className="w-7 h-7 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 flex items-center justify-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </button>
                      <button onClick={() => toast.error(isRtl ? 'تم الرفض' : 'Rejected')}
                        className="w-7 h-7 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center">
                        <XCircle className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pending withdrawals */}
            <Card className="p-5 glass border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-[#9d4edd]" />
                  {isRtl ? 'سحوبات معلقة' : 'Pending Withdrawals'}
                </h3>
                <Badge className="bg-amber-500/20 text-amber-400 border-0">{pendingWithdrawals.length}</Badge>
              </div>
              <div className="space-y-2">
                {pendingWithdrawals.map((w, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass">
                    <div className="w-9 h-9 rounded-full bg-[#9d4edd]/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-[#9d4edd]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{w.user}</div>
                      <div className="text-xs text-muted-foreground">{w.amount} {w.currency} • {w.time}</div>
                    </div>
                    <div className="text-end">
                      <div className="text-sm font-bold">{w.value}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => toast.success(isRtl ? 'تم القبول' : 'Approved')}
                        className="w-7 h-7 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 flex items-center justify-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </button>
                      <button onClick={() => toast.error(isRtl ? 'تم الرفض' : 'Rejected')}
                        className="w-7 h-7 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center">
                        <XCircle className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Plans management */}
        <TabsContent value="plans" className="space-y-4">
          <Card className="p-5 glass border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{isRtl ? 'إدارة الخطط' : 'Plan Management'}</h3>
              <Button size="sm" className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0"
                onClick={() => toast.success(isRtl ? 'فتح نموذج إنشاء خطة' : 'Open create form')}>
                <Plus className="h-4 w-4 me-1" />
                {isRtl ? 'إنشاء خطة' : 'Create Plan'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {miningPlans.map((plan) => (
                <div key={plan.id} className="p-4 rounded-2xl glass border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold">{plan.id === 'basic' ? (isRtl ? 'الأساسية' : 'Basic') : plan.id === 'silver' ? (isRtl ? 'الفضية' : 'Silver') : plan.id === 'gold' ? (isRtl ? 'الذهبية' : 'Gold') : (isRtl ? 'الماسية' : 'Diamond')}</span>
                    <span className="text-xl">{plan.id === 'basic' ? '🥉' : plan.id === 'silver' ? '🥈' : plan.id === 'gold' ? '🥇' : '💎'}</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">{isRtl ? 'الاستثمار' : 'Investment'}</span><span className="font-medium">${plan.investment}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">{isRtl ? 'يومي' : 'Daily'}</span><span className="font-medium">{plan.dailyProfit}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">{isRtl ? 'المدة' : 'Duration'}</span><span className="font-medium">{plan.duration}d</span></div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3 glass"
                    onClick={() => toast.success(isRtl ? 'تعديل الخطة' : 'Edit plan')}>
                    <Edit className="h-3 w-3 me-1" />
                    {isRtl ? 'تعديل' : 'Edit'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Tasks management */}
        <TabsContent value="tasks" className="space-y-4">
          <Card className="p-5 glass border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{isRtl ? 'إدارة المهام' : 'Task Management'}</h3>
              <Button size="sm" className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0"
                onClick={() => toast.success(isRtl ? 'فتح نموذج مهمة' : 'Open task form')}>
                <Plus className="h-4 w-4 me-1" />
                {isRtl ? 'إضافة مهمة' : 'Add Task'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: isRtl ? 'تسجيل الدخول اليومي' : 'Daily Check-in', reward: '$1', active: true },
                { name: isRtl ? 'مشاهدة فيديو' : 'Watch Video', reward: '$2.5', active: true },
                { name: isRtl ? 'متابعة X' : 'Follow X', reward: '50 pts', active: true },
                { name: isRtl ? 'دعوة 5 أصدقاء' : 'Invite 5 Friends', reward: '$50', active: true },
                { name: isRtl ? 'استثمار $1000' : 'Invest $1000', reward: '500 pts', active: false },
                { name: isRtl ? 'ترقية VIP' : 'VIP Upgrade', reward: '$25', active: true },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{isRtl ? 'المكافأة' : 'Reward'}: {t.reward}</div>
                  </div>
                  <Switch defaultChecked={t.active} />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-5 glass border-white/5">
            <h3 className="font-bold mb-4">{isRtl ? 'إعدادات النظام' : 'System Settings'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{isRtl ? 'اسم المنصة' : 'Platform Name'}</Label>
                <Input defaultValue="CryptoMine 2026" className="bg-white/5" />
              </div>
              <div className="space-y-2">
                <Label>{isRtl ? 'الحد الأدنى للسحب ($)' : 'Min Withdrawal ($)'}</Label>
                <Input type="number" defaultValue="20" className="bg-white/5" />
              </div>
              <div className="space-y-2">
                <Label>{isRtl ? 'رسوم السحب الافتراضية (%)' : 'Default Withdrawal Fee (%)'}</Label>
                <Input type="number" defaultValue="1" className="bg-white/5" />
              </div>
              <div className="space-y-2">
                <Label>{isRtl ? 'API Key - Binance' : 'API Key - Binance'}</Label>
                <Input type="password" placeholder="••••••••••••" className="bg-white/5 font-mono" />
              </div>
              <div className="space-y-2">
                <Label>{isRtl ? 'API Key - Coinbase' : 'API Key - Coinbase'}</Label>
                <Input type="password" placeholder="••••••••••••" className="bg-white/5 font-mono" />
              </div>
              <div className="space-y-2">
                <Label>{isRtl ? 'Telegram Bot Token' : 'Telegram Bot Token'}</Label>
                <Input type="password" placeholder="••••••••••••" className="bg-white/5 font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="flex items-center justify-between p-3 rounded-xl glass">
                <span className="text-sm">{isRtl ? 'وضع الصيانة' : 'Maintenance Mode'}</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl glass">
                <span className="text-sm">{isRtl ? 'reCAPTCHA' : 'reCAPTCHA'}</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl glass">
                <span className="text-sm">{isRtl ? 'تسجيلات جديدة' : 'New Signups'}</span>
                <Switch defaultChecked />
              </div>
            </div>
            <Button className="mt-6 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0"
              onClick={() => toast.success(isRtl ? 'تم حفظ الإعدادات!' : 'Settings saved!')}>
              <Save className="h-4 w-4 me-2" />
              {isRtl ? 'حفظ الإعدادات' : 'Save Settings'}
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
