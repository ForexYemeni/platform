'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { CheckCircle2, Play, Twitter, Users, Link as LinkIcon, Calendar, Crown, Gift, Sparkles, ChevronRight, Loader2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

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
  userTasks?: any[]
}

export function TasksPage() {
  const { lang, fetchCurrentUser } = useAppStore()
  const isRtl = lang === 'ar'
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch real tasks from API
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/tasks')
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          // Only ACTIVE tasks are returned from API
          setTasks(data.data.tasks || [])
        }
      }
    } catch (e) {
      console.error('Failed to fetch tasks:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async (taskId: string) => {
    setActionLoading(taskId)
    try {
      const res = await fetch('/api/user/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, action: 'claim' })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(isRtl
          ? `تم استلام ${data.data.reward} ${data.data.type === 'USDT' ? '$' : 'نقطة'}!`
          : `Claimed ${data.data.reward} ${data.data.type === 'USDT' ? '$' : 'points'}!`
        )
        fetchTasks()
        fetchCurrentUser()
      } else {
        toast.error(data.error || 'Failed')
      }
    } catch (e) {
      toast.error('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleComplete = async (taskId: string) => {
    setActionLoading(taskId)
    try {
      const res = await fetch('/api/user/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, action: 'complete' })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(isRtl ? 'تم إكمال المهمة!' : 'Task completed!')
        fetchTasks()
      } else {
        toast.error(data.error || 'Failed')
      }
    } catch (e) {
      toast.error('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  const dailyTasks = tasks.filter(t => t.type === 'DAILY')
  const weeklyTasks = tasks.filter(t => t.type === 'WEEKLY')
  const specialTasks = tasks.filter(t => t.type === 'SPECIAL')

  // Get user task state
  const getUserTask = (task: Task) => {
    return task.userTasks?.[0] || null
  }

  const completedCount = tasks.filter(t => getUserTask(t)?.completed).length
  const totalReward = tasks.filter(t => {
    const ut = getUserTask(t)
    return ut?.completed && !ut?.claimed && t.rewardType === 'USDT'
  }).reduce((s, t) => s + t.reward, 0)

  const stats = [
    { label: isRtl ? 'مهام مكتملة' : 'Tasks Completed', value: `${completedCount}/${tasks.length}`, icon: CheckCircle2, color: '#10b981' },
    { label: isRtl ? 'مكافآت متاحة' : 'Rewards Available', value: `$${totalReward.toFixed(2)}`, icon: Gift, color: '#ffd700' },
    { label: isRtl ? 'نقاطك' : 'Your Points', value: '0', icon: Sparkles, color: '#9d4edd' },
    { label: isRtl ? 'تتابع' : 'Day Streak', value: '0', icon: Calendar, color: '#00d4ff' },
  ]

  const renderTaskCard = (task: Task) => {
    const userTask = getUserTask(task)
    const completed = userTask?.completed || false
    const claimed = userTask?.claimed || false
    const progress = userTask?.progress || 0

    return (
      <motion.div
        key={task.id}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-4 rounded-2xl border transition-all ${
          claimed
            ? 'border-emerald-500/20 bg-emerald-500/5 opacity-60'
            : completed
            ? 'border-[#ffd700]/30 bg-[#ffd700]/5'
            : 'border-white/5 glass hover:border-white/10'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
              completed ? 'bg-[#ffd700]/20' : 'bg-white/5'
            }`}
          >
            {task.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-semibold text-sm">
                {isRtl ? task.titleAr : task.title}
              </h4>
              <Badge className={`flex-shrink-0 ${task.rewardType === 'USDT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#9d4edd]/20 text-[#9d4edd]'} border-0`}>
                +{task.reward}{task.rewardType === 'USDT' ? '$' : 'P'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {isRtl ? task.descriptionAr : task.description}
            </p>

            {task.total && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{isRtl ? 'التقدم' : 'Progress'}</span>
                  <span>{progress}/{task.total}</span>
                </div>
                <Progress value={task.total > 0 ? (progress / task.total) * 100 : 0} className="h-1.5" />
              </div>
            )}

            <div className="flex gap-2">
              {claimed ? (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-0 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {isRtl ? 'تم الاستلام' : 'Claimed'}
                </Badge>
              ) : completed ? (
                <Button
                  size="sm"
                  onClick={() => handleClaim(task.id)}
                  disabled={actionLoading === task.id}
                  className="bg-gradient-to-r from-[#ffd700] to-[#ff8c00] text-black border-0"
                >
                  {actionLoading === task.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (
                    <>
                      <Gift className="h-3.5 w-3.5 me-1.5" />
                      {isRtl ? 'استلام المكافأة' : 'Claim Reward'}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleComplete(task.id)}
                  disabled={actionLoading === task.id}
                  className="glass"
                >
                  {actionLoading === task.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (
                    <>
                      {isRtl ? 'إكمال المهمة' : 'Complete Task'}
                      <ChevronRight className="h-3.5 w-3.5 ms-1.5 rtl:rotate-180" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
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
          {isRtl ? 'المهام اليومية' : 'Daily Tasks'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isRtl ? 'أكمل المهام واربح عملات ونقاط إضافية' : 'Complete tasks and earn extra coins and points'}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <Card key={i} className="p-4 glass border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${stat.color}20` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-[11px] text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Tasks tabs */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="daily">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-4 glass">
            <TabsTrigger value="daily">
              {isRtl ? 'يومية' : 'Daily'}
              <Badge className="ms-2 bg-[#00d4ff]/20 text-[#00d4ff] border-0 text-[10px]">{dailyTasks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="weekly">
              {isRtl ? 'أسبوعية' : 'Weekly'}
              <Badge className="ms-2 bg-[#9d4edd]/20 text-[#9d4edd] border-0 text-[10px]">{weeklyTasks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="special">
              {isRtl ? 'خاصة' : 'Special'}
              <Badge className="ms-2 bg-[#ffd700]/20 text-[#ffd700] border-0 text-[10px]">{specialTasks.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-3">
            {dailyTasks.length === 0 ? (
              <Card className="p-8 text-center glass border-white/5">
                <p className="text-sm text-muted-foreground">{isRtl ? 'لا توجد مهام يومية نشطة' : 'No active daily tasks'}</p>
              </Card>
            ) : dailyTasks.map(renderTaskCard)}
          </TabsContent>
          <TabsContent value="weekly" className="space-y-3">
            {weeklyTasks.length === 0 ? (
              <Card className="p-8 text-center glass border-white/5">
                <p className="text-sm text-muted-foreground">{isRtl ? 'لا توجد مهام أسبوعية نشطة' : 'No active weekly tasks'}</p>
              </Card>
            ) : weeklyTasks.map(renderTaskCard)}
          </TabsContent>
          <TabsContent value="special" className="space-y-3">
            {specialTasks.length === 0 ? (
              <Card className="p-8 text-center glass border-white/5">
                <p className="text-sm text-muted-foreground">{isRtl ? 'لا توجد مهام خاصة نشطة' : 'No active special tasks'}</p>
              </Card>
            ) : specialTasks.map(renderTaskCard)}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
