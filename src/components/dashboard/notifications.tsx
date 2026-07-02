'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Bell, Check } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function NotificationsPage() {
  const { lang, notifications, markAllRead } = useAppStore()
  const isRtl = lang === 'ar'

  const iconMap = {
    success: CheckCircle2,
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
  }

  const colorMap = {
    success: '#10b981',
    info: '#00d4ff',
    warning: '#f59e0b',
    error: '#ef4444',
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {isRtl ? 'الإشعارات' : 'Notifications'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRtl ? 'ابق على اطلاع بآخر تحديثات حسابك' : 'Stay updated with your account activities'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => { markAllRead(); toast.success(isRtl ? 'تم تحديد الكل كمقروء' : 'All marked as read') }}
          className="glass"
        >
          <Check className="h-4 w-4 me-2" />
          {isRtl ? 'تحديد الكل كمقروء' : 'Mark All Read'}
        </Button>
      </motion.div>

      {/* Notification channels */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: isRtl ? 'داخل الموقع' : 'In-App', active: true, color: '#00d4ff' },
          { label: isRtl ? 'البريد الإلكتروني' : 'Email', active: true, color: '#9d4edd' },
          { label: 'Telegram', active: true, color: '#0088cc' },
          { label: isRtl ? 'دفع فوري' : 'Push', active: false, color: '#ffd700' },
        ].map((ch, i) => (
          <Card key={i} className="p-4 glass border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{ch.label}</span>
              <span
                className={`w-2 h-2 rounded-full ${ch.active ? 'animate-pulse' : ''}`}
                style={{ background: ch.active ? ch.color : 'rgba(255,255,255,0.2)' }}
              />
            </div>
            <div className="text-sm font-bold">
              {ch.active ? (isRtl ? 'مفعّل' : 'Active') : (isRtl ? 'غير مفعّل' : 'Inactive')}
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Notifications list */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-5 glass border-white/5">
          <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-luxury">
            {notifications.map((n, i) => {
              const Icon = iconMap[n.type]
              const color = colorMap[n.type]
              return (
                <motion.div
                  key={n.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-start gap-3 p-4 rounded-2xl transition-all cursor-pointer ${
                    n.read ? 'bg-transparent hover:bg-accent/30' : 'bg-accent/40 hover:bg-accent/50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}20`, border: `1px solid ${color}40` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{n.title}</h4>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[#9d4edd] flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                </motion.div>
              )
            })}

            {/* Empty state if all read */}
            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {isRtl ? 'لا توجد إشعارات' : 'No notifications'}
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
