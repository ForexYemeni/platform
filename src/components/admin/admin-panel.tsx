'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Users, DollarSign, TrendingUp, TrendingDown, Search, MoreHorizontal,
  Shield, CheckCircle2, XCircle, Clock, Ban, Edit, Send, Plus,
  Cpu, CreditCard, CheckSquare, Settings, Activity, Crown, AlertCircle, Save,
  Trash2, Wallet, X, Loader2, Gift, Power, Zap
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { useAppStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

interface Task {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  type: string
  reward: number
  rewardType: string
  icon: string
  total: number | null
  active: boolean
}

interface Wallet {
  id: string
  currency: string
  network: string
  address: string
  label: string | null
  active: boolean
}

export function AdminPanel() {
  const { lang, setView } = useAppStore()
  const isRtl = lang === 'ar'

  const [realStats, setRealStats] = useState<any>(null)
  const [realUsers, setRealUsers] = useState<any[]>([])
  const [pendingDeposits, setPendingDeposits] = useState<any[]>([])
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Fetch all admin data
  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, depositsRes, withdrawalsRes, plansRes, tasksRes, walletsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users?limit=50'),
        fetch('/api/admin/deposits'),
        fetch('/api/admin/withdrawals'),
        fetch('/api/admin/plans'),
        fetch('/api/admin/tasks'),
        fetch('/api/admin/wallets'),
      ])

      if (statsRes.ok) { const d = await statsRes.json(); if (d.success) setRealStats(d.data) }
      if (usersRes.ok) { const d = await usersRes.json(); if (d.success) setRealUsers(d.data.users || []) }
      if (depositsRes.ok) { const d = await depositsRes.json(); if (d.success) setPendingDeposits((d.data.deposits || []).filter((x: any) => x.status === 'PENDING')) }
      if (withdrawalsRes.ok) { const d = await withdrawalsRes.json(); if (d.success) setPendingWithdrawals((d.data.withdrawals || []).filter((x: any) => x.status === 'PENDING')) }
      if (plansRes.ok) { const d = await plansRes.json(); if (d.success) setPlans(d.data.plans || []) }
      if (tasksRes.ok) { const d = await tasksRes.json(); if (d.success) setTasks(d.data.tasks || []) }
      if (walletsRes.ok) { const d = await walletsRes.json(); if (d.success) setWallets(d.data.wallets || []) }
    } catch (e) {
      console.error('Admin data fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAllData() }, [])

  // Stats
  const stats = [
    { label: isRtl ? 'إجمالي المستخدمين' : 'Total Users', value: realStats?.totalUsers?.toLocaleString() || '0', icon: Users, color: '#00d4ff' },
    { label: isRtl ? 'المستخدمون النشطون' : 'Active Users', value: realStats?.activeUsers?.toLocaleString() || '0', icon: Activity, color: '#10b981' },
    { label: isRtl ? 'صافي الإيرادات' : 'Net Revenue', value: `$${(realStats?.netRevenue || 0).toLocaleString()}`, icon: DollarSign, color: '#ffd700' },
    { label: isRtl ? 'إجمالي الإيداعات' : 'Total Deposits', value: `$${(realStats?.totalDepositsAmount || 0).toLocaleString()}`, icon: TrendingUp, color: '#9d4edd' },
    { label: isRtl ? 'إجمالي السحوبات' : 'Total Withdrawals', value: `$${(realStats?.totalWithdrawalsAmount || 0).toLocaleString()}`, icon: TrendingDown, color: '#ef4444' },
    { label: isRtl ? 'مستخدمون محظورون' : 'Blocked', value: realStats?.blockedUsers?.toLocaleString() || '0', icon: Crown, color: '#06b6d4' },
  ]

  const pieData = [
    { name: 'Active', value: realStats?.activeUsers || 0, color: '#10b981' },
    { name: 'Blocked', value: realStats?.blockedUsers || 0, color: '#ef4444' },
  ]

  const filteredUsers = realUsers.filter((u: any) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  // === Handlers ===
  const handleApproveDeposit = async (id: string) => {
    const res = await fetch('/api/admin/deposits', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ depositId: id, action: 'approve' }) })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تمت الموافقة' : 'Approved'); fetchAllData() }
    else toast.error(d.error)
  }
  const handleRejectDeposit = async (id: string) => {
    const res = await fetch('/api/admin/deposits', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ depositId: id, action: 'reject' }) })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تم الرفض' : 'Rejected'); fetchAllData() }
    else toast.error(d.error)
  }
  const handleApproveWithdrawal = async (id: string) => {
    const res = await fetch('/api/admin/withdrawals', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ withdrawalId: id, action: 'approve' }) })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تمت الموافقة' : 'Approved'); fetchAllData() }
    else toast.error(d.error)
  }
  const handleRejectWithdrawal = async (id: string) => {
    const res = await fetch('/api/admin/withdrawals', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ withdrawalId: id, action: 'reject' }) })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تم الرفض' : 'Rejected'); fetchAllData() }
    else toast.error(d.error)
  }
  const handleBlockUser = async (userId: string, block: boolean) => {
    const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, action: block ? 'block' : 'unblock' }) })
    const d = await res.json()
    if (d.success) { toast.success(block ? (isRtl ? 'تم الحظر' : 'Blocked') : (isRtl ? 'تم إلغاء الحظر' : 'Unblocked')); fetchAllData() }
    else toast.error(d.error)
  }

  const [editingUser, setEditingUser] = useState<any>(null)
  const [deleteUserModal, setDeleteUserModal] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteUser = async (userId: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' })
      const d = await res.json()
      if (d.success) {
        toast.success(isRtl ? 'تم حذف المستخدم نهائياً' : 'User permanently deleted')
        setDeleteUserModal(null)
        fetchAllData()
      } else toast.error(d.error)
    } catch (e) { toast.error('Network error') }
    finally { setDeleting(false) }
  }

  const handleChangeEmail = async (userId: string, newEmail: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action: 'changeEmail', value: newEmail })
    })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تم تغيير البريد' : 'Email changed'); fetchAllData() }
    else toast.error(d.error)
  }

  const handleChangePassword = async (userId: string, newPassword: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action: 'changePassword', value: newPassword })
    })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تم تغيير كلمة المرور' : 'Password changed') }
    else toast.error(d.error)
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-6 w-6 text-[#ffd700]" />
            <h1 className="text-2xl md:text-3xl font-bold">{isRtl ? 'لوحة الإدارة' : 'Admin Panel'}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{isRtl ? 'إدارة المنصة والمستخدمين والمدفوعات' : 'Manage platform, users and payments'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0 gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {isRtl ? 'الأنظمة تعمل' : 'Systems Online'}
          </Badge>
          <Button onClick={() => setView('dashboard')} variant="outline" className="glass">
            {isRtl ? 'العودة' : 'Back'}
          </Button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-4 glass border-white/5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${stat.color}20` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div className="text-xl font-black">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <Card className="p-5 glass border-white/5">
            <h3 className="font-bold mb-4">{isRtl ? 'توزيع المستخدمين' : 'User Distribution'}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={[
                { name: 'Active', value: realStats?.activeUsers || 0 },
                { name: 'Blocked', value: realStats?.blockedUsers || 0 },
              ]}>
                <defs>
                  <linearGradient id="colorU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="value" stroke="#00d4ff" strokeWidth={2} fill="url(#colorU)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="p-5 glass border-white/5 h-full">
            <h3 className="font-bold mb-4">{isRtl ? 'نظرة عامة' : 'Overview'}</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {pieData.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="text-muted-foreground">{p.name}</span>
                  <span className="font-medium ms-auto">{p.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Management tabs */}
      <Tabs defaultValue="users">
        <TabsList className="glass overflow-x-auto no-scrollbar flex-wrap h-auto">
          <TabsTrigger value="users"><Users className="h-4 w-4 me-2" />{isRtl ? 'المستخدمون' : 'Users'}</TabsTrigger>
          <TabsTrigger value="payments"><CreditCard className="h-4 w-4 me-2" />{isRtl ? 'المدفوعات' : 'Payments'}</TabsTrigger>
          <TabsTrigger value="plans"><Cpu className="h-4 w-4 me-2" />{isRtl ? 'الخطط' : 'Plans'}</TabsTrigger>
          <TabsTrigger value="tasks"><CheckSquare className="h-4 w-4 me-2" />{isRtl ? 'المهام' : 'Tasks'}</TabsTrigger>
          <TabsTrigger value="wallets"><Wallet className="h-4 w-4 me-2" />{isRtl ? 'المحافظ' : 'Wallets'}</TabsTrigger>
          <TabsTrigger value="rewards"><Gift className="h-4 w-4 me-2" />{isRtl ? 'المكافآت' : 'Rewards'}</TabsTrigger>
          <TabsTrigger value="referrals"><Users className="h-4 w-4 me-2" />{isRtl ? 'الإحالات' : 'Referrals'}</TabsTrigger>
          <TabsTrigger value="mining"><Cpu className="h-4 w-4 me-2" />{isRtl ? 'التعدين' : 'Mining'}</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="h-4 w-4 me-2" />{isRtl ? 'الإعدادات' : 'Settings'}</TabsTrigger>
        </TabsList>

        {/* === USERS === */}
        <TabsContent value="users">
          <Card className="p-5 glass border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <h3 className="font-bold">{isRtl ? 'إدارة المستخدمين' : 'User Management'}</h3>
              <div className="relative flex-1 sm:flex-none w-full sm:w-64">
                <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder={isRtl ? 'بحث...' : 'Search...'} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-10 bg-white/5" />
              </div>
            </div>
            <div className="overflow-x-auto scrollbar-luxury">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="text-start font-medium pb-3 ps-2">{isRtl ? 'المستخدم' : 'User'}</th>
                    <th className="text-start font-medium pb-3 hidden md:table-cell">{isRtl ? 'الرصيد' : 'Balance'}</th>
                    <th className="text-start font-medium pb-3 hidden lg:table-cell">{isRtl ? 'VIP' : 'VIP'}</th>
                    <th className="text-start font-medium pb-3 hidden md:table-cell">{isRtl ? 'انضم' : 'Joined'}</th>
                    <th className="text-start font-medium pb-3">{isRtl ? 'الحالة' : 'Status'}</th>
                    <th className="text-start font-medium pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">{loading ? (isRtl ? 'جارٍ التحميل...' : 'Loading...') : (isRtl ? 'لا يوجد' : 'No users')}</td></tr>
                  ) : filteredUsers.map((u: any) => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-accent/30">
                      <td className="py-3 ps-2">
                        <div className="font-medium text-sm">{u.name || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="py-3 font-semibold hidden md:table-cell">${(u.balance || 0).toFixed(2)}</td>
                      <td className="py-3 hidden lg:table-cell">VIP {u.vipLevel || 1}</td>
                      <td className="py-3 hidden md:table-cell text-muted-foreground text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                      <td className="py-3">
                        <Badge className={u.isBlocked ? 'bg-red-500/20 text-red-400 border-0' : u.isAdmin ? 'bg-[#ffd700]/20 text-[#ffd700] border-0' : 'bg-emerald-500/20 text-emerald-400 border-0'}>
                          {u.isBlocked ? (isRtl ? 'محظور' : 'Blocked') : u.isAdmin ? (isRtl ? 'مدير' : 'Admin') : (isRtl ? 'نشط' : 'Active')}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          {!u.isAdmin && (
                            <>
                              <Button size="sm" variant="outline" className="glass" onClick={() => setEditingUser(u)} title={isRtl ? 'تعديل' : 'Edit'}>
                                <Edit className="h-3.5 w-3.5 text-[#00d4ff]" />
                              </Button>
                              <Button size="sm" variant="outline" className="glass" onClick={() => handleBlockUser(u.id, !u.isBlocked)} title={u.isBlocked ? (isRtl ? 'إلغاء الحظر' : 'Unblock') : (isRtl ? 'حظر' : 'Block')}>
                                {u.isBlocked ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Ban className="h-3.5 w-3.5 text-red-400" />}
                              </Button>
                              <Button size="sm" variant="outline" className="glass" onClick={() => setDeleteUserModal(u)} title={isRtl ? 'حذف' : 'Delete'}>
                                <Trash2 className="h-3.5 w-3.5 text-red-400" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* === PAYMENTS === */}
        <TabsContent value="payments">
          <PaymentsManager
            pendingDeposits={pendingDeposits}
            pendingWithdrawals={pendingWithdrawals}
            onApproveDeposit={handleApproveDeposit}
            onRejectDeposit={handleRejectDeposit}
            onApproveWithdrawal={handleApproveWithdrawal}
            onRejectWithdrawal={handleRejectWithdrawal}
          />
        </TabsContent>

        {/* === PLANS === */}
        <TabsContent value="plans">
          <PlansManager plans={plans} loading={loading} onRefresh={fetchAllData} />
        </TabsContent>

        {/* === TASKS === */}
        <TabsContent value="tasks">
          <TasksManager tasks={tasks} loading={loading} onRefresh={fetchAllData} />
        </TabsContent>

        {/* === WALLETS === */}
        <TabsContent value="wallets">
          <WalletsManager wallets={wallets} loading={loading} onRefresh={fetchAllData} />
        </TabsContent>

        {/* === REWARDS === */}
        <TabsContent value="rewards">
          <RewardsManager users={realUsers} onRefresh={fetchAllData} />
        </TabsContent>

        {/* === REFERRALS === */}
        <TabsContent value="referrals">
          <ReferralsManager />
        </TabsContent>

        {/* === MINING CONTROL === */}
        <TabsContent value="mining">
          <MiningControlManager onRefresh={fetchAllData} />
        </TabsContent>

        {/* === SETTINGS === */}
        <TabsContent value="settings">
          <SettingsManager onRefresh={fetchAllData} />
        </TabsContent>
      </Tabs>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onChangeEmail={handleChangeEmail}
          onChangePassword={handleChangePassword}
        />
      )}

      {/* Delete User Confirmation Modal */}
      {deleteUserModal && (
        <DeleteUserModal
          user={deleteUserModal}
          deleting={deleting}
          onConfirm={() => handleDeleteUser(deleteUserModal.id)}
          onClose={() => setDeleteUserModal(null)}
        />
      )}
    </div>
  )
}

// ============================================
// PLANS MANAGER - Full CRUD
// ============================================
function PlansManager({ plans, loading, onRefresh }: { plans: Plan[], loading: boolean, onRefresh: () => void }) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [editing, setEditing] = useState<Plan | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async (data: any) => {
    setSaving(true)
    try {
      const method = editing ? 'PATCH' : 'POST'
      const body = editing ? { id: editing.id, ...data } : data
      const res = await fetch('/api/admin/plans', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await res.json()
      if (d.success) {
        toast.success(editing ? (isRtl ? 'تم تحديث الخطة' : 'Plan updated') : (isRtl ? 'تم إنشاء الخطة' : 'Plan created'))
        setShowForm(false)
        setEditing(null)
        onRefresh()
      } else toast.error(d.error)
    } catch (e) { toast.error('Network error') }
    finally { setSaving(false) }
  }

  const handleToggle = async (plan: Plan) => {
    const res = await fetch('/api/admin/plans', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: plan.id, active: !plan.active }) })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تم التحديث' : 'Updated'); onRefresh() }
    else toast.error(d.error)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد؟' : 'Are you sure?')) return
    const res = await fetch(`/api/admin/plans?id=${id}`, { method: 'DELETE' })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تم الحذف' : 'Deleted'); onRefresh() }
    else toast.error(d.error)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#00d4ff]" /></div>

  return (
    <Card className="p-5 glass border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">{isRtl ? 'إدارة الخطط' : 'Plan Management'}</h3>
        <Button size="sm" className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0" onClick={() => { setEditing(null); setShowForm(true) }}>
          <Plus className="h-4 w-4 me-1" />{isRtl ? 'إضافة خطة' : 'Add Plan'}
        </Button>
      </div>

      {showForm && (
        <PlanForm plan={editing} saving={saving} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null) }} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {plans.map((p) => (
          <div key={p.id} className={`p-4 rounded-2xl glass border ${p.active ? 'border-white/10' : 'border-red-500/20 opacity-60'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{p.icon === 'gold' ? '🥇' : p.icon === 'diamond' ? '💎' : p.icon === 'silver' ? '🥈' : '🥉'}</span>
                <div>
                  <div className="font-bold">{isRtl ? p.nameAr : p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.hashrate}</div>
                </div>
              </div>
              {p.popular && <Badge className="bg-[#ffd700]/20 text-[#ffd700] border-0 text-[10px]">Popular</Badge>}
            </div>
            <div className="space-y-1 text-sm mb-3">
              <div className="flex justify-between"><span className="text-muted-foreground">{isRtl ? 'الاستثمار' : 'Investment'}</span><span className="font-semibold">${p.investment}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{isRtl ? 'يومي' : 'Daily'}</span><span className="font-semibold text-emerald-400">{p.dailyProfit}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{isRtl ? 'المدة' : 'Duration'}</span><span className="font-semibold">{p.duration}d</span></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="glass flex-1" onClick={() => { setEditing(p); setShowForm(true) }}>
                <Edit className="h-3 w-3 me-1" />{isRtl ? 'تعديل' : 'Edit'}
              </Button>
              <Button size="sm" variant="outline" className="glass" onClick={() => handleToggle(p)}>
                {p.active ? <Ban className="h-3 w-3 text-red-400" /> : <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
              </Button>
              <Button size="sm" variant="outline" className="glass" onClick={() => handleDelete(p.id)}>
                <Trash2 className="h-3 w-3 text-red-400" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function PlanForm({ plan, saving, onSave, onCancel }: { plan: Plan | null, saving: boolean, onSave: (data: any) => void, onCancel: () => void }) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [form, setForm] = useState({
    name: plan?.name || '',
    nameAr: plan?.nameAr || '',
    investment: plan?.investment || 100,
    dailyProfit: plan?.dailyProfit || 2,
    duration: plan?.duration || 30,
    hashrate: plan?.hashrate || '1.0 TH/s',
    color: plan?.color || '#00d4ff',
    gradient: plan?.gradient || 'from-[#00d4ff] to-[#9d4edd]',
    icon: plan?.icon || 'default',
    popular: plan?.popular || false,
    active: plan?.active !== false,
  })

  return (
    <div className="p-4 rounded-2xl glass border-[#00d4ff]/20 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold">{plan ? (isRtl ? 'تعديل خطة' : 'Edit Plan') : (isRtl ? 'خطة جديدة' : 'New Plan')}</h4>
        <button onClick={onCancel}><X className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>{isRtl ? 'الاسم (EN)' : 'Name (EN)'}</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'الاسم (AR)' : 'Name (AR)'}</Label><Input value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})} className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'الاستثمار ($)' : 'Investment ($)'}</Label><Input type="number" value={form.investment} onChange={e => setForm({...form, investment: parseFloat(e.target.value)})} className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'الربح اليومي (%)' : 'Daily Profit (%)'}</Label><Input type="number" step="0.1" value={form.dailyProfit} onChange={e => setForm({...form, dailyProfit: parseFloat(e.target.value)})} className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'المدة (أيام)' : 'Duration (days)'}</Label><Input type="number" value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value)})} className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'القوة' : 'Hashrate'}</Label><Input value={form.hashrate} onChange={e => setForm({...form, hashrate: e.target.value})} className="bg-white/5" /></div>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <label className="flex items-center gap-2 text-sm"><Switch checked={form.popular} onCheckedChange={v => setForm({...form, popular: v})} />{isRtl ? 'الأكثر شعبية' : 'Popular'}</label>
        <label className="flex items-center gap-2 text-sm"><Switch checked={form.active} onCheckedChange={v => setForm({...form, active: v})} />{isRtl ? 'نشط' : 'Active'}</label>
      </div>
      <div className="flex gap-2 mt-4">
        <Button onClick={() => onSave(form)} disabled={saving} className="flex-1 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 me-1" />{isRtl ? 'حفظ' : 'Save'}</>}
        </Button>
        <Button variant="outline" className="glass" onClick={onCancel}>{isRtl ? 'إلغاء' : 'Cancel'}</Button>
      </div>
    </div>
  )
}

// ============================================
// TASKS MANAGER - Full CRUD
// ============================================
function TasksManager({ tasks, loading, onRefresh }: { tasks: Task[], loading: boolean, onRefresh: () => void }) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [editing, setEditing] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async (data: any) => {
    setSaving(true)
    try {
      const method = editing ? 'PATCH' : 'POST'
      const body = editing ? { id: editing.id, ...data } : data
      const res = await fetch('/api/admin/tasks', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await res.json()
      if (d.success) {
        toast.success(editing ? (isRtl ? 'تم التحديث' : 'Updated') : (isRtl ? 'تم الإنشاء' : 'Created'))
        setShowForm(false); setEditing(null); onRefresh()
      } else toast.error(d.error)
    } catch (e) { toast.error('Network error') }
    finally { setSaving(false) }
  }

  const handleToggle = async (task: Task) => {
    const res = await fetch('/api/admin/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: task.id, active: !task.active }) })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تم التحديث' : 'Updated'); onRefresh() }
    else toast.error(d.error)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد؟' : 'Are you sure?')) return
    const res = await fetch(`/api/admin/tasks?id=${id}`, { method: 'DELETE' })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تم الحذف' : 'Deleted'); onRefresh() }
    else toast.error(d.error)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#00d4ff]" /></div>

  return (
    <Card className="p-5 glass border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">{isRtl ? 'إدارة المهام' : 'Task Management'}</h3>
        <Button size="sm" className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0" onClick={() => { setEditing(null); setShowForm(true) }}>
          <Plus className="h-4 w-4 me-1" />{isRtl ? 'إضافة مهمة' : 'Add Task'}
        </Button>
      </div>

      {showForm && <TaskForm task={editing} saving={saving} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null) }} />}

      <div className="space-y-2 mt-4">
        {tasks.map((t) => (
          <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl glass border ${t.active ? 'border-white/10' : 'border-red-500/20 opacity-60'}`}>
            <span className="text-2xl">{t.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{isRtl ? t.titleAr : t.title}</div>
              <div className="text-xs text-muted-foreground">
                +{t.reward} {t.rewardType} • {t.type}
              </div>
            </div>
            <Badge className={t.type === 'DAILY' ? 'bg-[#00d4ff]/20 text-[#00d4ff] border-0' : t.type === 'WEEKLY' ? 'bg-[#9d4edd]/20 text-[#9d4edd] border-0' : 'bg-[#ffd700]/20 text-[#ffd700] border-0'}>
              {t.type}
            </Badge>
            <Button size="sm" variant="outline" className="glass" onClick={() => { setEditing(t); setShowForm(true) }}><Edit className="h-3 w-3" /></Button>
            <Button size="sm" variant="outline" className="glass" onClick={() => handleToggle(t)}>
              {t.active ? <Ban className="h-3 w-3 text-red-400" /> : <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
            </Button>
            <Button size="sm" variant="outline" className="glass" onClick={() => handleDelete(t.id)}><Trash2 className="h-3 w-3 text-red-400" /></Button>
          </div>
        ))}
      </div>
    </Card>
  )
}

function TaskForm({ task, saving, onSave, onCancel }: { task: Task | null, saving: boolean, onSave: (data: any) => void, onCancel: () => void }) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [form, setForm] = useState({
    title: task?.title || '',
    titleAr: task?.titleAr || '',
    description: task?.description || '',
    descriptionAr: task?.descriptionAr || '',
    type: task?.type || 'DAILY',
    reward: task?.reward || 1,
    rewardType: task?.rewardType || 'USDT',
    icon: task?.icon || '✅',
    total: task?.total || null,
    active: task?.active !== false,
  })

  return (
    <div className="p-4 rounded-2xl glass border-[#00d4ff]/20 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold">{task ? (isRtl ? 'تعديل مهمة' : 'Edit Task') : (isRtl ? 'مهمة جديدة' : 'New Task')}</h4>
        <button onClick={onCancel}><X className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>{isRtl ? 'العنوان (EN)' : 'Title (EN)'}</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'العنوان (AR)' : 'Title (AR)'}</Label><Input value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'الوصف (EN)' : 'Desc (EN)'}</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'الوصف (AR)' : 'Desc (AR)'}</Label><Input value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})} className="bg-white/5" /></div>
        <div>
          <Label>{isRtl ? 'النوع' : 'Type'}</Label>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full h-9 px-3 rounded-lg bg-white/5 border border-border">
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="SPECIAL">Special</option>
          </select>
        </div>
        <div>
          <Label>{isRtl ? 'نوع المكافأة' : 'Reward Type'}</Label>
          <select value={form.rewardType} onChange={e => setForm({...form, rewardType: e.target.value})} className="w-full h-9 px-3 rounded-lg bg-white/5 border border-border">
            <option value="USDT">USDT</option>
            <option value="POINTS">Points</option>
          </select>
        </div>
        <div><Label>{isRtl ? 'المكافأة' : 'Reward'}</Label><Input type="number" step="0.1" value={form.reward} onChange={e => setForm({...form, reward: parseFloat(e.target.value)})} className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'الأيقونة' : 'Icon'}</Label><Input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="bg-white/5" /></div>
      </div>
      <label className="flex items-center gap-2 text-sm mt-3"><Switch checked={form.active} onCheckedChange={v => setForm({...form, active: v})} />{isRtl ? 'نشط' : 'Active'}</label>
      <div className="flex gap-2 mt-4">
        <Button onClick={() => onSave(form)} disabled={saving} className="flex-1 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 me-1" />{isRtl ? 'حفظ' : 'Save'}</>}
        </Button>
        <Button variant="outline" className="glass" onClick={onCancel}>{isRtl ? 'إلغاء' : 'Cancel'}</Button>
      </div>
    </div>
  )
}

// ============================================
// WALLETS MANAGER - Full CRUD
// ============================================
function WalletsManager({ wallets, loading, onRefresh }: { wallets: Wallet[], loading: boolean, onRefresh: () => void }) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [editing, setEditing] = useState<Wallet | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async (data: any) => {
    setSaving(true)
    try {
      const method = editing ? 'PATCH' : 'POST'
      const body = editing ? { id: editing.id, ...data } : data
      const res = await fetch('/api/admin/wallets', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await res.json()
      if (d.success) {
        toast.success(editing ? (isRtl ? 'تم التحديث' : 'Updated') : (isRtl ? 'تم الإضافة' : 'Added'))
        setShowForm(false); setEditing(null); onRefresh()
      } else toast.error(d.error)
    } catch (e) { toast.error('Network error') }
    finally { setSaving(false) }
  }

  const handleToggle = async (w: Wallet) => {
    const res = await fetch('/api/admin/wallets', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: w.id, active: !w.active }) })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تم التحديث' : 'Updated'); onRefresh() }
    else toast.error(d.error)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد؟' : 'Are you sure?')) return
    const res = await fetch(`/api/admin/wallets?id=${id}`, { method: 'DELETE' })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تم الحذف' : 'Deleted'); onRefresh() }
    else toast.error(d.error)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#00d4ff]" /></div>

  return (
    <Card className="p-5 glass border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold">{isRtl ? 'إدارة عناوين الإيداع' : 'Deposit Wallet Addresses'}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isRtl ? 'أضف عناوين حقيقية لكل عملة ليراها المستخدمون عند الإيداع' : 'Add real addresses for each currency that users see when depositing'}
          </p>
        </div>
        <Button size="sm" className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0" onClick={() => { setEditing(null); setShowForm(true) }}>
          <Plus className="h-4 w-4 me-1" />{isRtl ? 'إضافة عنوان' : 'Add Address'}
        </Button>
      </div>

      {showForm && (
        <WalletForm wallet={editing} saving={saving} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null) }} />
      )}

      {wallets.length === 0 ? (
        <div className="text-center py-12">
          <Wallet className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-1">
            {isRtl ? 'لا توجد عناوين إيداع بعد' : 'No deposit addresses yet'}
          </p>
          <p className="text-xs text-muted-foreground/70">
            {isRtl ? 'أضف عناوين حقيقية لكل عملة ليراها المستخدمون' : 'Add real addresses for users to deposit to'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          {wallets.map((w) => (
            <div key={w.id} className={`flex items-center gap-3 p-3 rounded-xl glass border ${w.active ? 'border-white/10' : 'border-red-500/20 opacity-60'}`}>
              <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-[#00d4ff]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{w.currency} <span className="text-xs text-muted-foreground">({w.network})</span></div>
                <div className="text-xs text-muted-foreground font-mono truncate">{w.address}</div>
              </div>
              <Badge className={w.active ? 'bg-emerald-500/20 text-emerald-400 border-0' : 'bg-red-500/20 text-red-400 border-0'}>
                {w.active ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'متوقف' : 'Disabled')}
              </Badge>
              <Button size="sm" variant="outline" className="glass" onClick={() => { setEditing(w); setShowForm(true) }}><Edit className="h-3 w-3" /></Button>
              <Button size="sm" variant="outline" className="glass" onClick={() => handleToggle(w)}>
                {w.active ? <Ban className="h-3 w-3 text-red-400" /> : <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
              </Button>
              <Button size="sm" variant="outline" className="glass" onClick={() => handleDelete(w.id)}><Trash2 className="h-3 w-3 text-red-400" /></Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function WalletForm({ wallet, saving, onSave, onCancel }: { wallet: Wallet | null, saving: boolean, onSave: (data: any) => void, onCancel: () => void }) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'

  // USDT with all available networks
  const usdtNetworks = [
    { value: 'TRC20', label: 'USDT - TRC20 (Tron)', currency: 'USDT-TRC20' },
    { value: 'ERC20', label: 'USDT - ERC20 (Ethereum)', currency: 'USDT-ERC20' },
    { value: 'BEP20', label: 'USDT - BEP20 (BNB Smart Chain)', currency: 'USDT-BEP20' },
    { value: 'Solana', label: 'USDT - Solana', currency: 'USDT-Solana' },
    { value: 'Polygon', label: 'USDT - Polygon', currency: 'USDT-Polygon' },
    { value: 'Arbitrum One', label: 'USDT - Arbitrum One', currency: 'USDT-Arbitrum One' },
    { value: 'Optimism', label: 'USDT - Optimism', currency: 'USDT-Optimism' },
    { value: 'Avalanche C-Chain', label: 'USDT - Avalanche C-Chain', currency: 'USDT-Avalanche C-Chain' },
  ]

  // Find current network selection
  const getCurrentNetwork = () => {
    if (!wallet) return 'TRC20'
    return wallet.network || 'TRC20'
  }

  const [form, setForm] = useState({
    network: getCurrentNetwork(),
    address: wallet?.address || '',
    label: wallet?.label || '',
    active: wallet?.active !== false,
  })

  const selectedNetwork = usdtNetworks.find(n => n.network === form.network) || usdtNetworks[0]

  const handleSave = () => {
    onSave({
      currency: selectedNetwork.currency,
      network: form.network,
      address: form.address,
      label: form.label,
      active: form.active,
    })
  }

  return (
    <div className="p-4 rounded-2xl glass border-[#00d4ff]/20 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold">{wallet ? (isRtl ? 'تعديل عنوان' : 'Edit Address') : (isRtl ? 'عنوان جديد' : 'New Address')}</h4>
        <button onClick={onCancel}><X className="h-4 w-4" /></button>
      </div>

      <div className="p-3 rounded-xl bg-[#26a17b]/10 border border-[#26a17b]/20 mb-3 flex items-center gap-2">
        <span className="text-2xl">₮</span>
        <div>
          <div className="text-sm font-bold text-[#26a17b]">USDT فقط</div>
          <div className="text-xs text-muted-foreground">{isRtl ? 'جميع الشبكات المتاحة لـ USDT' : 'All available USDT networks'}</div>
        </div>
      </div>

      <div className="mb-3">
        <Label>{isRtl ? 'الشبكة' : 'Network'}</Label>
        <select
          value={form.network}
          onChange={e => setForm({...form, network: e.target.value})}
          className="w-full h-10 px-3 rounded-lg bg-white/5 border border-border"
        >
          {usdtNetworks.map(n => (
            <option key={n.value} value={n.value}>{n.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <Label>{isRtl ? 'العنوان' : 'Address'}</Label>
        <Input
          value={form.address}
          onChange={e => setForm({...form, address: e.target.value})}
          placeholder={isRtl ? `أدخل عنوان USDT ${form.network}` : `Enter USDT ${form.network} address`}
          className="bg-white/5 font-mono"
        />
      </div>

      <div className="mb-3">
        <Label>{isRtl ? 'تسمية (اختياري)' : 'Label (optional)'}</Label>
        <Input
          value={form.label}
          onChange={e => setForm({...form, label: e.target.value})}
          placeholder={isRtl ? 'مثلاً: المحفظة الرئيسية' : 'e.g. Main wallet'}
          className="bg-white/5"
        />
      </div>

      <label className="flex items-center gap-2 text-sm mt-3">
        <Switch checked={form.active} onCheckedChange={v => setForm({...form, active: v})} />
        {isRtl ? 'نشط' : 'Active'}
      </label>

      <div className="flex gap-2 mt-4">
        <Button onClick={handleSave} disabled={saving || !form.address} className="flex-1 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 me-1" />{isRtl ? 'حفظ' : 'Save'}</>}
        </Button>
        <Button variant="outline" className="glass" onClick={onCancel}>{isRtl ? 'إلغاء' : 'Cancel'}</Button>
      </div>
    </div>
  )
}

// ============================================
// REWARDS MANAGER - Admin creates gifts for users
// ============================================
function RewardsManager({ users, onRefresh }: { users: any[], onRefresh: () => void }) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string>('')

  const fetchRewards = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/rewards')
      if (res.ok) {
        const data = await res.json()
        if (data.success) setRewards(data.data.rewards || [])
      }
    } catch (e) {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchRewards() }, [])

  const handleSave = async (data: any) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const d = await res.json()
      if (d.success) {
        toast.success(isRtl ? 'تم إرسال المكافأة للمستخدم!' : 'Reward sent to user!')
        setShowForm(false)
        fetchRewards()
      } else toast.error(d.error)
    } catch (e) { toast.error('Network error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(isRtl ? 'حذف المكافأة؟' : 'Delete reward?')) return
    const res = await fetch(`/api/admin/rewards?id=${id}`, { method: 'DELETE' })
    const d = await res.json()
    if (d.success) { toast.success(isRtl ? 'تم الحذف' : 'Deleted'); fetchRewards() }
    else toast.error(d.error)
  }

  return (
    <Card className="p-5 glass border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold flex items-center gap-2">
            <Gift className="h-5 w-5 text-[#ffd700]" />
            {isRtl ? 'إدارة المكافآت' : 'Rewards Management'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isRtl ? 'أرسل مكافآت وهدايا للمستخدمين (تظهر كبطاقة هدية 🎁)' : 'Send rewards and gifts to users (shown as gift card 🎁)'}
          </p>
        </div>
        <Button size="sm" className="bg-gradient-to-r from-[#ffd700] to-[#ff8c00] text-black border-0" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 me-1" />{isRtl ? 'إرسال مكافأة' : 'Send Reward'}
        </Button>
      </div>

      {showForm && (
        <RewardForm
          users={users}
          saving={saving}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-[#ffd700]" /></div>
      ) : rewards.length === 0 ? (
        <div className="text-center py-12">
          <Gift className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{isRtl ? 'لا توجد مكافآت مُرسلة بعد' : 'No rewards sent yet'}</p>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          {rewards.map((r) => (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl glass border border-white/10">
              <span className="text-2xl">{r.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{r.title}</div>
                <div className="text-xs text-muted-foreground">
                  {isRtl ? 'المستخدم:' : 'User:'} {r.user?.name || r.user?.email || 'Unknown'}
                </div>
              </div>
              <Badge className="bg-[#ffd700]/20 text-[#ffd700] border-0">+{r.amount} {r.currency}</Badge>
              <Badge className={r.claimed ? 'bg-emerald-500/20 text-emerald-400 border-0' : 'bg-amber-500/20 text-amber-400 border-0'}>
                {r.claimed ? (isRtl ? 'تم الاستلام' : 'Claimed') : (isRtl ? 'في الانتظار' : 'Pending')}
              </Badge>
              <Button size="sm" variant="outline" className="glass" onClick={() => handleDelete(r.id)}>
                <Trash2 className="h-3 w-3 text-red-400" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function RewardForm({ users, saving, onSave, onCancel }: { users: any[], saving: boolean, onSave: (data: any) => void, onCancel: () => void }) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [form, setForm] = useState({
    userId: '',
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    amount: 10,
    currency: 'USDT',
    type: 'GIFT',
    icon: '🎁',
  })

  // Filter out admin users
  const regularUsers = users.filter(u => !u.isAdmin)

  return (
    <div className="p-4 rounded-2xl glass border-[#ffd700]/20 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold flex items-center gap-2">
          <Gift className="h-4 w-4 text-[#ffd700]" />
          {isRtl ? 'إرسال مكافأة جديدة' : 'Send New Reward'}
        </h4>
        <button onClick={onCancel}><X className="h-4 w-4" /></button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label>{isRtl ? 'المستخدم' : 'User'}</Label>
          <select value={form.userId} onChange={e => setForm({...form, userId: e.target.value})} className="w-full h-10 px-3 rounded-lg bg-white/5 border border-border">
            <option value="">{isRtl ? 'اختر مستخدم...' : 'Select user...'}</option>
            {regularUsers.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>
        <div><Label>{isRtl ? 'العنوان (EN)' : 'Title (EN)'}</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Invite 5 Friends Reward" className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'العنوان (AR)' : 'Title (AR)'}</Label><Input value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} placeholder="مكافأة دعوة 5 أصدقاء" className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'الوصف (EN)' : 'Desc (EN)'}</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Thank you for inviting 5 active friends!" className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'الوصف (AR)' : 'Desc (AR)'}</Label><Input value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})} placeholder="شكراً لدعوة 5 أصدقاء نشطين!" className="bg-white/5" /></div>
        <div><Label>{isRtl ? 'المبلغ' : 'Amount'}</Label><Input type="number" step="0.1" value={form.amount} onChange={e => setForm({...form, amount: parseFloat(e.target.value)})} className="bg-white/5" /></div>
        <div>
          <Label>{isRtl ? 'النوع' : 'Type'}</Label>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full h-9 px-3 rounded-lg bg-white/5 border border-border">
            <option value="GIFT">{isRtl ? '🎁 هدية' : '🎁 Gift'}</option>
            <option value="BONUS">{isRtl ? '💎 مكافأة' : '💎 Bonus'}</option>
            <option value="MILESTONE">{isRtl ? '🏆 إنجاز' : '🏆 Milestone'}</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          onClick={() => onSave(form)}
          disabled={saving || !form.userId || !form.title}
          className="flex-1 bg-gradient-to-r from-[#ffd700] to-[#ff8c00] text-black border-0"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Gift className="h-4 w-4 me-1" />{isRtl ? 'إرسال المكافأة' : 'Send Reward'}</>}
        </Button>
        <Button variant="outline" className="glass" onClick={onCancel}>{isRtl ? 'إلغاء' : 'Cancel'}</Button>
      </div>
    </div>
  )
}

// ============================================
// REFERRALS MANAGER - Full referral system control
// ============================================
function ReferralsManager() {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/referrals')
      if (res.ok) {
        const d = await res.json()
        if (d.success) setData(d.data)
      }
    } catch (e) {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const filteredUsers = (data?.users || []).filter((u: any) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.referralCode?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Overall stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 glass border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#00d4ff]" />
            </div>
            <div>
              <div className="text-lg font-bold">{data?.stats?.totalUsers || 0}</div>
              <div className="text-xs text-muted-foreground">{isRtl ? 'إجمالي المستخدمين' : 'Total Users'}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 glass border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9d4edd]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#9d4edd]" />
            </div>
            <div>
              <div className="text-lg font-bold">{data?.stats?.totalReferrals || 0}</div>
              <div className="text-xs text-muted-foreground">{isRtl ? 'إجمالي الإحالات' : 'Total Referrals'}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 glass border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-[#10b981]" />
            </div>
            <div>
              <div className="text-lg font-bold">{data?.stats?.totalActiveReferrals || 0}</div>
              <div className="text-xs text-muted-foreground">{isRtl ? 'إحالات نشطة' : 'Active Referrals'}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 glass border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffd700]/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-[#ffd700]" />
            </div>
            <div>
              <div className="text-lg font-bold">${(data?.stats?.totalEarnings || 0).toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">{isRtl ? 'عمولات مدفوعة' : 'Commissions Paid'}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Users table with referral stats */}
      <Card className="p-5 glass border-white/5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <h3 className="font-bold">{isRtl ? 'إحالات كل مستخدم' : 'User Referrals'}</h3>
          <div className="relative flex-1 sm:flex-none w-full sm:w-64">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder={isRtl ? 'بحث...' : 'Search...'} value={search} onChange={e => setSearch(e.target.value)} className="ps-10 bg-white/5" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-[#00d4ff]" /></div>
        ) : (
          <div className="overflow-x-auto scrollbar-luxury">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-start font-medium pb-3 ps-2">{isRtl ? 'المستخدم' : 'User'}</th>
                  <th className="text-start font-medium pb-3">{isRtl ? 'رمز الدعوة' : 'Referral Code'}</th>
                  <th className="text-start font-medium pb-3 hidden md:table-cell">{isRtl ? 'دُعي بواسطة' : 'Referred By'}</th>
                  <th className="text-start font-medium pb-3">{isRtl ? 'الإحالات' : 'Referrals'}</th>
                  <th className="text-start font-medium pb-3 hidden lg:table-cell">{isRtl ? 'النشطة' : 'Active'}</th>
                  <th className="text-start font-medium pb-3">{isRtl ? 'الأرباح' : 'Earnings'}</th>
                  <th className="text-start font-medium pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">{isRtl ? 'لا يوجد' : 'No users'}</td></tr>
                ) : filteredUsers.map((u: any) => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-accent/30">
                    <td className="py-3 ps-2">
                      <div className="font-medium text-sm">{u.name || 'Unknown'}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className="font-mono border-[#00d4ff]/30 text-[#00d4ff]">{u.referralCode}</Badge>
                    </td>
                    <td className="py-3 hidden md:table-cell text-xs text-muted-foreground">
                      {u.referredBy ? `${u.referredBy.name} (${u.referredBy.referralCode})` : (isRtl ? 'مباشر' : 'Direct')}
                    </td>
                    <td className="py-3 font-semibold">{u.referralCount}</td>
                    <td className="py-3 hidden lg:table-cell text-emerald-400">{u.activeReferralCount}</td>
                    <td className="py-3 font-semibold text-[#ffd700]">${u.referralEarnings.toFixed(2)}</td>
                    <td className="py-3">
                      <Button size="sm" variant="outline" className="glass" onClick={() => setSelectedUser(u)}>
                        {isRtl ? 'تفاصيل' : 'Details'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* User referral details modal */}
      {selectedUser && (
        <UserReferralDetail user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}

function UserReferralDetail({ user, onClose }: { user: any, onClose: () => void }) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/referrals?userId=${user.id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data) })
      .finally(() => setLoading(false))
  }, [user.id])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-luxury"
      >
        <div className="glass rounded-3xl border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="outline" className="font-mono border-[#00d4ff]/30 text-[#00d4ff] mt-2">{user.referralCode}</Badge>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full glass flex items-center justify-center"><X className="h-4 w-4" /></button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : data ? (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl glass text-center">
                  <div className="text-2xl font-black text-[#00d4ff]">{data.tree.level1.count}</div>
                  <div className="text-xs text-muted-foreground">{isRtl ? 'المستوى 1' : 'Level 1'}</div>
                </div>
                <div className="p-3 rounded-xl glass text-center">
                  <div className="text-2xl font-black text-[#9d4edd]">{data.tree.level2.count}</div>
                  <div className="text-xs text-muted-foreground">{isRtl ? 'المستوى 2' : 'Level 2'}</div>
                </div>
                <div className="p-3 rounded-xl glass text-center">
                  <div className="text-2xl font-black text-[#ffd700]">${data.totalEarnings.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{isRtl ? 'الأرباح' : 'Earnings'}</div>
                </div>
              </div>

              {/* Referred users */}
              <div>
                <h4 className="font-bold mb-2 text-sm">{isRtl ? 'المستوى 1 - الإحالات المباشرة' : 'Level 1 - Direct Referrals'}</h4>
                {data.tree.level1.users.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">{isRtl ? 'لا توجد إحالات' : 'No referrals'}</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-luxury">
                    {data.tree.level1.users.map((u: any) => (
                      <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg glass">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#9d4edd] flex items-center justify-center text-white text-xs font-bold">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                        <Badge className={u.activePlanId ? 'bg-emerald-500/20 text-emerald-400 border-0' : 'bg-muted/20 text-muted-foreground border-0'}>
                          {u.activePlanId ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'غير نشط' : 'Inactive')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">{isRtl ? 'فشل تحميل البيانات' : 'Failed to load'}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// MINING CONTROL MANAGER - Full mining system control
// ============================================
function MiningControlManager({ onRefresh }: { onRefresh: () => void }) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [settings, setSettings] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      if (d.success) setSettings(d.data.settings)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          miningMode: settings.miningMode,
          miningStartTime: parseInt(settings.miningStartTime),
          miningDurationHours: parseInt(settings.miningDurationHours),
          miningAutoRenewDefault: settings.miningAutoRenewDefault,
          minMiningBalance: parseFloat(settings.minMiningBalance),
        })
      })
      const d = await res.json()
      if (d.success) {
        toast.success(isRtl ? 'تم حفظ إعدادات التعدين' : 'Mining settings saved')
        onRefresh()
      } else toast.error(d.error)
    } catch (e) { toast.error('Network error') }
    finally { setSaving(false) }
  }

  if (loading || !settings) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#00d4ff]" /></div>

  return (
    <div className="space-y-4">
      {/* Mining Mode */}
      <Card className="p-5 glass border-border">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-[#00d4ff]" />
          {isRtl ? 'إعدادات التحكم بالتعدين' : 'Mining Control Settings'}
        </h3>

        <div className="space-y-4">
          {/* Mining Mode */}
          <div className="p-4 rounded-xl glass">
            <Label className="mb-3 block">{isRtl ? 'وضع التعدين' : 'Mining Mode'}</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSettings({ ...settings, miningMode: 'manual' })}
                className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${settings.miningMode === 'manual' ? 'border-[#00d4ff] bg-[#00d4ff]/10' : 'border-border glass'}`}
              >
                <Power className="h-5 w-5" />
                <div className="text-start">
                  <div className="font-medium text-sm">{isRtl ? 'يدوي' : 'Manual'}</div>
                  <div className="text-xs text-muted-foreground">{isRtl ? 'المستخدم يفعّل يومياً' : 'User activates daily'}</div>
                </div>
              </button>
              <button
                onClick={() => setSettings({ ...settings, miningMode: 'auto' })}
                className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${settings.miningMode === 'auto' ? 'border-[#10b981] bg-[#10b981]/10' : 'border-border glass'}`}
              >
                <Zap className="h-5 w-5" />
                <div className="text-start">
                  <div className="font-medium text-sm">{isRtl ? 'تلقائي' : 'Automatic'}</div>
                  <div className="text-xs text-muted-foreground">{isRtl ? 'يبدأ تلقائياً' : 'Starts automatically'}</div>
                </div>
              </button>
            </div>
          </div>

          {/* Start Time */}
          <div className="p-4 rounded-xl glass">
            <Label className="mb-2 block">{isRtl ? 'وقت بدء التعدين (الساعة)' : 'Mining Start Time (Hour)'}</Label>
            <select
              value={settings.miningStartTime || 0}
              onChange={e => setSettings({ ...settings, miningStartTime: parseInt(e.target.value) })}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border"
            >
              {Array.from({ length: 24 }).map((_, h) => {
                const period = h < 12 ? 'AM' : 'PM'
                const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
                const periodAr = h < 12 ? 'صباحاً' : 'مساءً'
                return (
                  <option key={h} value={h}>
                    {h12}:00 {period} ({isRtl ? periodAr : (h < 12 ? 'Morning' : 'Evening')}) - مكة
                  </option>
                )
              })}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              {isRtl ? 'الوقت الذي يبدأ عنده التعدين التلقائي أو المقترح للمستخدم' : 'When auto mining starts or suggested time for manual'}
            </p>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl glass">
              <Label className="mb-2 block">{isRtl ? 'مدة التعدين (ساعات)' : 'Mining Duration (Hours)'}</Label>
              <Input
                type="number"
                value={settings.miningDurationHours || 24}
                onChange={e => setSettings({ ...settings, miningDurationHours: e.target.value })}
                className="bg-background"
                min="1"
                max="48"
              />
            </div>
            <div className="p-4 rounded-xl glass">
              <Label className="mb-2 block">{isRtl ? 'الحد الأدنى للسحب ($)' : 'Min Withdrawal ($)'}</Label>
              <Input
                type="number"
                step="0.01"
                value={settings.minMiningBalance || 0.01}
                onChange={e => setSettings({ ...settings, minMiningBalance: e.target.value })}
                className="bg-background"
                min="0.01"
              />
            </div>
          </div>

          {/* Auto-renew default */}
          <div className="flex items-center justify-between p-4 rounded-xl glass">
            <div>
              <span className="text-sm font-medium">{isRtl ? 'التعدين التلقائي افتراضياً' : 'Auto-Renew Default'}</span>
              <p className="text-xs text-muted-foreground mt-1">
                {isRtl ? 'تفعيل التعدين التلقائي للمستخدمين الجدد افتراضياً' : 'Enable auto-renew by default for new users'}
              </p>
            </div>
            <Switch
              checked={settings.miningAutoRenewDefault || false}
              onCheckedChange={v => setSettings({ ...settings, miningAutoRenewDefault: v })}
            />
          </div>

          {/* Info box */}
          <div className="p-4 rounded-xl bg-[#00d4ff]/5 border border-[#00d4ff]/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-[#00d4ff] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">{isRtl ? 'كيف يعمل نظام التعدين:' : 'How mining system works:'}</p>
                <p>{isRtl ? '• المستخدم يفعّل التعدين يومياً (يدوياً أو تلقائياً)' : '• User activates mining daily (manual or auto)'}</p>
                <p>{isRtl ? '• التعدين يدوم حسب المدة المحددة (افتراضي 24 ساعة)' : '• Mining lasts for specified duration (default 24h)'}</p>
                <p>{isRtl ? '• الأرباح تُحسب بناءً على الوقت الفعلي للتعدين' : '• Profits calculated based on actual mining time'}</p>
                <p>{isRtl ? '• عند انتهاء الجلسة، تُضاف الأرباح للمتراكم' : '• When session ends, profits added to accumulated'}</p>
                <p>{isRtl ? '• المستخدم يسحب الأرباح المتراكمة (رأس المال مقفل)' : '• User withdraws accumulated (capital locked)'}</p>
                <p>{isRtl ? '• رأس المال يُعاد عند انتهاء الخطة' : '• Capital returned when plan expires'}</p>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 me-2" />{isRtl ? 'حفظ إعدادات التعدين' : 'Save Mining Settings'}</>}
          </Button>
        </div>
      </Card>
    </div>
  )
}

// ============================================
// PAYMENTS MANAGER - Deposits & Withdrawals with full details
// ============================================
function PaymentsManager({ pendingDeposits, pendingWithdrawals, onApproveDeposit, onRejectDeposit, onApproveWithdrawal, onRejectWithdrawal }: {
  pendingDeposits: any[],
  pendingWithdrawals: any[],
  onApproveDeposit: (id: string) => void,
  onRejectDeposit: (id: string) => void,
  onApproveWithdrawal: (id: string) => void,
  onRejectWithdrawal: (id: string) => void,
}) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [tab, setTab] = useState('pending')

  return (
    <div className="space-y-4">
      {/* Pending Withdrawals - with FULL details */}
      {pendingWithdrawals.length > 0 && (
        <Card className="p-5 glass border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-amber-500" />
              {isRtl ? 'سحوبات معلقة - عرض تفصيلي' : 'Pending Withdrawals - Full Details'}
            </h3>
            <Badge className="bg-amber-500/20 text-amber-600 border-0">{pendingWithdrawals.length}</Badge>
          </div>
          <div className="space-y-3">
            {pendingWithdrawals.map((w: any) => (
              <div key={w.id} className="p-4 rounded-xl glass border border-amber-500/10">
                {/* User + Amount */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-medium text-sm">{w.user?.name || w.user?.email || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">{w.user?.email}</div>
                  </div>
                  <div className="text-lg font-black text-red-500">-${w.amount}</div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">{isRtl ? 'العملة' : 'Currency'}: </span>
                    <span className="font-medium">{w.currency}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">{isRtl ? 'الشبكة' : 'Network'}: </span>
                    <span className="font-medium">{w.network}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">{isRtl ? 'الرسوم' : 'Fee'}: </span>
                    <span className="font-medium">{w.fee}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">{isRtl ? 'التاريخ' : 'Date'}: </span>
                    <span className="font-medium">{new Date(w.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Withdrawal address - CRITICAL for admin to send funds */}
                <div className="p-3 rounded-lg bg-[#00d4ff]/5 border border-[#00d4ff]/20 mb-3">
                  <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'عنوان الاستلام (أرسل العملات هنا)' : 'Withdrawal Address (Send funds here)'}</div>
                  <div className="font-mono text-sm break-all">{w.address}</div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(w.address); toast.success(isRtl ? 'تم النسخ!' : 'Copied!') }}
                    className="mt-2 text-xs text-[#00d4ff] hover:underline"
                  >
                    {isRtl ? 'نسخ العنوان' : 'Copy address'}
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onApproveWithdrawal(w.id)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                    <CheckCircle2 className="h-4 w-4 me-1" />{isRtl ? 'موافقة وإرسال' : 'Approve & Send'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onRejectWithdrawal(w.id)} className="flex-1 glass text-red-500 border-red-500/30">
                    <XCircle className="h-4 w-4 me-1" />{isRtl ? 'رفض' : 'Reject'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pending Deposits */}
      {pendingDeposits.length > 0 && (
        <Card className="p-5 glass border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#00d4ff]" />
              {isRtl ? 'إيداعات معلقة' : 'Pending Deposits'}
            </h3>
            <Badge className="bg-amber-500/20 text-amber-600 border-0">{pendingDeposits.length}</Badge>
          </div>
          <div className="space-y-2">
            {pendingDeposits.map((d: any) => (
              <div key={d.id} className="p-3 rounded-xl glass border border-amber-500/10">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="font-medium text-sm">{d.user?.name || d.user?.email || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">{d.user?.email}</div>
                  </div>
                  <div className="text-lg font-black text-emerald-500">+${d.amount}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">{isRtl ? 'العملة' : 'Currency'}: </span>
                    <span className="font-medium">{d.currency}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">{isRtl ? 'الشبكة' : 'Network'}: </span>
                    <span className="font-medium">{d.network}</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-muted/30 mb-3 text-xs">
                  <span className="text-muted-foreground">{isRtl ? 'عنوان الإيداع' : 'Deposit Address'}: </span>
                  <span className="font-mono break-all">{d.address}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onApproveDeposit(d.id)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                    <CheckCircle2 className="h-4 w-4 me-1" />{isRtl ? 'موافقة' : 'Approve'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onRejectDeposit(d.id)} className="flex-1 glass text-red-500 border-red-500/30">
                    <XCircle className="h-4 w-4 me-1" />{isRtl ? 'رفض' : 'Reject'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty state */}
      {pendingDeposits.length === 0 && pendingWithdrawals.length === 0 && (
        <Card className="p-12 text-center glass border-white/5">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">{isRtl ? 'لا توجد معاملات معلقة' : 'No pending transactions'}</p>
          <p className="text-xs text-muted-foreground/70 mt-1">{isRtl ? 'كل الإيداعات والسحوبات تمت معالجتها' : 'All deposits and withdrawals are processed'}</p>
        </Card>
      )}
    </div>
  )
}

// ============================================
// EDIT USER MODAL - Change email & password
// ============================================
function EditUserModal({ user, onClose, onChangeEmail, onChangePassword }: {
  user: any,
  onClose: () => void,
  onChangeEmail: (userId: string, email: string) => void,
  onChangePassword: (userId: string, password: string) => void,
}) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const handleSaveEmail = async () => {
    setSavingEmail(true)
    await onChangeEmail(user.id, email)
    setSavingEmail(false)
  }

  const handleSavePassword = async () => {
    if (password.length < 6) {
      toast.error(isRtl ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters')
      return
    }
    setSavingPassword(true)
    await onChangePassword(user.id, password)
    setPassword('')
    setSavingPassword(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">{isRtl ? 'تعديل المستخدم' : 'Edit User'}</h3>
            <button onClick={onClose} className="w-9 h-9 rounded-full glass flex items-center justify-center"><X className="h-4 w-4" /></button>
          </div>

          <div className="space-y-4">
            <div className="p-3 rounded-xl glass">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
              <div className="text-xs text-muted-foreground mt-1">{isRtl ? 'الرصيد' : 'Balance'}: ${user.balance?.toFixed(2)}</div>
            </div>

            {/* Change Email */}
            <div>
              <Label className="mb-2 block">{isRtl ? 'تغيير البريد الإلكتروني' : 'Change Email'}</Label>
              <div className="flex gap-2">
                <Input value={email} onChange={e => setEmail(e.target.value)} className="bg-white/5" type="email" />
                <Button onClick={handleSaveEmail} disabled={savingEmail || email === user.email} className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0">
                  {savingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Change Password */}
            <div>
              <Label className="mb-2 block">{isRtl ? 'تغيير كلمة المرور' : 'Change Password'}</Label>
              <div className="flex gap-2">
                <Input value={password} onChange={e => setPassword(e.target.value)} className="bg-white/5" type="password" placeholder={isRtl ? 'كلمة مرور جديدة' : 'New password'} />
                <Button onClick={handleSavePassword} disabled={savingPassword || !password} className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0">
                  {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{isRtl ? '6 أحرف على الأقل' : 'At least 6 characters'}</p>
            </div>
          </div>

          <Button variant="outline" className="w-full glass mt-4" onClick={onClose}>{isRtl ? 'إغلاق' : 'Close'}</Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// DELETE USER MODAL - Confirmation card
// ============================================
function DeleteUserModal({ user, deleting, onConfirm, onClose }: {
  user: any,
  deleting: boolean,
  onConfirm: () => void,
  onClose: () => void,
}) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => !deleting && onClose()}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl border-red-500/30 p-6">
          {/* Warning icon */}
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-8 w-8 text-red-400" />
          </div>

          <h3 className="text-xl font-bold text-center mb-2">{isRtl ? 'حذف المستخدم نهائياً' : 'Delete User Permanently'}</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {isRtl ? 'سيتم حذف جميع بيانات المستخدم نهائياً. لا يمكن التراجع عن هذا الإجراء.' : 'All user data will be permanently deleted. This cannot be undone.'}
          </p>

          {/* User info */}
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#9d4edd] flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-red-500/10 text-xs text-red-300/70 space-y-1">
              <div>{isRtl ? 'الرصيد' : 'Balance'}: ${user.balance?.toFixed(2)}</div>
              <div>{isRtl ? 'إجمالي الأرباح' : 'Total Profit'}: ${user.totalProfit?.toFixed(2)}</div>
              <div>{isRtl ? 'انضم في' : 'Joined'}: {new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Warning details */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
            <p className="text-xs text-amber-300/80">
              {isRtl
                ? '⚠️ سيتم حذف: الحساب، الإيداعات، السحوبات، المعاملات، الإشعارات، المهام، المكافآت، وسجلات الإحالات'
                : '⚠️ Will delete: Account, deposits, withdrawals, transactions, notifications, tasks, rewards, and referral records'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 glass" onClick={onClose} disabled={deleting}>
              {isRtl ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={onConfirm} disabled={deleting} className="flex-1 bg-gradient-to-r from-red-500 to-red-700 text-white border-0">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  <Trash2 className="h-4 w-4 me-2" />
                  {isRtl ? 'حذف نهائي' : 'Delete Permanently'}
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// SETTINGS MANAGER
// ============================================
function SettingsManager({ onRefresh }: { onRefresh: () => void }) {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [settings, setSettings] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => { if (d.success) setSettings(d.data.settings) })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
      const d = await res.json()
      if (d.success) { toast.success(isRtl ? 'تم الحفظ' : 'Saved'); onRefresh() }
      else toast.error(d.error)
    } catch (e) { toast.error('Network error') }
    finally { setSaving(false) }
  }

  if (!settings) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#00d4ff]" /></div>

  return (
    <Card className="p-5 glass border-white/5">
      <h3 className="font-bold mb-4">{isRtl ? 'إعدادات النظام' : 'System Settings'}</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl glass">
          <span className="text-sm">{isRtl ? 'وضع الصيانة' : 'Maintenance Mode'}</span>
          <Switch checked={settings.maintenanceMode} onCheckedChange={v => setSettings({...settings, maintenanceMode: v})} />
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl glass">
          <span className="text-sm">{isRtl ? 'السماح بتسجيلات جديدة' : 'Allow New Signups'}</span>
          <Switch checked={settings.signupEnabled} onCheckedChange={v => setSettings({...settings, signupEnabled: v})} />
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl glass">
          <span className="text-sm">{isRtl ? 'reCAPTCHA' : 'reCAPTCHA'}</span>
          <Switch checked={settings.recaptchaEnabled} onCheckedChange={v => setSettings({...settings, recaptchaEnabled: v})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>{isRtl ? 'الحد الأدنى للسحب ($)' : 'Min Withdrawal ($)'}</Label><Input type="number" value={settings.minWithdrawalUsd} onChange={e => setSettings({...settings, minWithdrawalUsd: parseFloat(e.target.value)})} className="bg-white/5" /></div>
          <div><Label>{isRtl ? 'رسوم السحب (%)' : 'Withdrawal Fee (%)'}</Label><Input type="number" step="0.1" value={settings.defaultWithdrawalFee} onChange={e => setSettings({...settings, defaultWithdrawalFee: parseFloat(e.target.value)})} className="bg-white/5" /></div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 me-2" />{isRtl ? 'حفظ الإعدادات' : 'Save Settings'}</>}
        </Button>
      </div>
    </Card>
  )
}
