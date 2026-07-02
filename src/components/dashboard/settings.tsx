'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { User, Shield, Globe, Bell, CreditCard, LogOut, Moon, Sun, Key, Mail, Smartphone, Crown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAppStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

export function SettingsPage() {
  const { lang, setLang, user, logout } = useAppStore()
  const { theme, setTheme } = useTheme()
  const isRtl = lang === 'ar'
  const [twoFA, setTwoFA] = useState(true)
  const [emailNotif, setEmailNotif] = useState(true)
  const [tgNotif, setTgNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(false)

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {isRtl ? 'الإعدادات' : 'Settings'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isRtl ? 'إدارة حسابك وأمانك وتفضيلاتك' : 'Manage your account, security and preferences'}
        </p>
      </motion.div>

      <Tabs defaultValue="profile">
        <TabsList className="glass overflow-x-auto no-scrollbar">
          <TabsTrigger value="profile"><User className="h-4 w-4 me-2" />{isRtl ? 'الملف الشخصي' : 'Profile'}</TabsTrigger>
          <TabsTrigger value="security"><Shield className="h-4 w-4 me-2" />{isRtl ? 'الأمان' : 'Security'}</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 me-2" />{isRtl ? 'الإشعارات' : 'Notifications'}</TabsTrigger>
          <TabsTrigger value="appearance"><Globe className="h-4 w-4 me-2" />{isRtl ? 'المظهر' : 'Appearance'}</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="p-6 glass border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Avatar className="w-20 h-20 bg-gradient-to-br from-[#00d4ff] to-[#9d4edd]">
                  <AvatarFallback className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -end-1 w-7 h-7 rounded-full bg-[#00d4ff] text-white flex items-center justify-center text-xs">
                  ✎
                </button>
              </div>
              <div>
                <h3 className="text-lg font-bold">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <Badge className="mt-1 bg-[#ffd700]/20 text-[#ffd700] border-0">
                  <Crown className="h-3 w-3 me-1" /> VIP {user?.vipLevel}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{isRtl ? 'الاسم الكامل' : 'Full Name'}</Label>
                <Input defaultValue={user?.name} className="bg-white/5" />
              </div>
              <div className="space-y-2">
                <Label>{isRtl ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input defaultValue={user?.email} disabled className="bg-white/5 opacity-60" />
              </div>
              <div className="space-y-2">
                <Label>{isRtl ? 'رقم الهاتف' : 'Phone Number'}</Label>
                <Input placeholder="+971 50 123 4567" className="bg-white/5" />
              </div>
              <div className="space-y-2">
                <Label>{isRtl ? 'الدولة' : 'Country'}</Label>
                <Input placeholder={isRtl ? 'الإمارات' : 'United Arab Emirates'} className="bg-white/5" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={() => toast.success(isRtl ? 'تم حفظ التغييرات!' : 'Changes saved!')}
                className="bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0">
                {isRtl ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
              <Button variant="outline" className="glass">{isRtl ? 'إلغاء' : 'Cancel'}</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <Card className="p-6 glass border-white/5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#00d4ff]" />
              {isRtl ? 'إعدادات الأمان' : 'Security Settings'}
            </h3>
            <div className="space-y-3">
              {[
                { icon: Key, title: isRtl ? 'تغيير كلمة المرور' : 'Change Password', desc: isRtl ? 'آخر تغيير: قبل 30 يوم' : 'Last changed 30 days ago', action: isRtl ? 'تغيير' : 'Change' },
                { icon: Smartphone, title: isRtl ? 'المصادقة الثنائية (2FA)' : 'Two-Factor Authentication', desc: isRtl ? 'حماية إضافية لحسابك' : 'Extra protection for your account', toggle: twoFA, setToggle: setTwoFA },
                { icon: Mail, title: isRtl ? 'تأكيد البريد' : 'Email Verification', desc: isRtl ? 'بريدك مؤكد' : 'Your email is verified', badge: isRtl ? 'مؤكد' : 'Verified' },
                { icon: Smartphone, title: isRtl ? 'قائمة الأجهزة' : 'Device Sessions', desc: isRtl ? '3 أجهزة نشطة' : '3 active devices', action: isRtl ? 'إدارة' : 'Manage' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl glass hover:border-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-[#00d4ff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  {item.toggle !== undefined ? (
                    <Switch checked={item.toggle} onCheckedChange={item.setToggle} />
                  ) : item.badge ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0">{item.badge}</Badge>
                  ) : (
                    <Button size="sm" variant="outline" className="glass">{item.action}</Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 glass border-red-500/20 bg-red-500/5">
            <h3 className="font-bold mb-2 text-red-400">{isRtl ? 'منطقة الخطر' : 'Danger Zone'}</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {isRtl ? 'تسجيل الخروج من جميع الأجهزة أو حذف الحساب' : 'Sign out of all devices or delete account'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="glass text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={logout}>
                <LogOut className="h-4 w-4 me-2" />
                {isRtl ? 'تسجيل الخروج' : 'Logout'}
              </Button>
              <Button variant="outline" className="glass text-red-400 border-red-500/30 hover:bg-red-500/10">
                {isRtl ? 'حذف الحساب' : 'Delete Account'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6 glass border-white/5">
            <h3 className="font-bold mb-4">{isRtl ? 'تفضيلات الإشعارات' : 'Notification Preferences'}</h3>
            <div className="space-y-3">
              {[
                { title: isRtl ? 'إشعارات البريد الإلكتروني' : 'Email Notifications', desc: isRtl ? 'الأرباح، الإيداعات، السحوبات' : 'Profits, deposits, withdrawals', toggle: emailNotif, setToggle: setEmailNotif },
                { title: isRtl ? 'إشعارات Telegram' : 'Telegram Notifications', desc: isRtl ? 'تنبيهات فورية عبر بوت Telegram' : 'Instant alerts via Telegram bot', toggle: tgNotif, setToggle: setTgNotif },
                { title: isRtl ? 'إشعارات الدفع الفوري' : 'Push Notifications', desc: isRtl ? 'إشعارات المتصفح' : 'Browser push notifications', toggle: pushNotif, setToggle: setPushNotif },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl glass">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Switch checked={item.toggle} onCheckedChange={item.setToggle} />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-4">
          <Card className="p-6 glass border-white/5">
            <h3 className="font-bold mb-4">{isRtl ? 'اللغة' : 'Language'}</h3>
            <div className="space-y-4">
              {/* Language */}
              <div className="p-4 rounded-xl glass">
                <Label className="mb-3 block">{isRtl ? 'اللغة' : 'Language'}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLang('ar')}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      lang === 'ar' ? 'border-[#9d4edd] bg-[#9d4edd]/10' : 'border-white/5 glass'
                    }`}
                  >
                    <span className="text-2xl">🇸🇦</span>
                    <span className="font-medium text-sm">العربية</span>
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      lang === 'en' ? 'border-[#9d4edd] bg-[#9d4edd]/10' : 'border-white/5 glass'
                    }`}
                  >
                    <span className="text-2xl">🇬🇧</span>
                    <span className="font-medium text-sm">English</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
