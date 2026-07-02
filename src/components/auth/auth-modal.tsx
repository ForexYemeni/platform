'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, Check, ShieldCheck, KeyRound, RefreshCw } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Logo } from '@/components/shared/logo'
import { toast } from 'sonner'

export function AuthModal() {
  const { authStage, setAuthStage, lang, login } = useAppStore()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [referralCode, setReferralCode] = useState('ADMIN001')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(45)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authStage === 'otp' || authStage === 'twofa') {
      const interval = setInterval(() => {
        setCountdown((c) => (c > 0 ? c - 1 : 0))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [authStage])

  if (authStage === 'closed') return null

  const close = () => {
    setAuthStage('closed')
    setEmail('')
    setPassword('')
    setName('')
    setOtp(['', '', '', '', '', ''])
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const endpoint = authStage === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = authStage === 'register'
        ? { name, email, password, referralCode }
        : { email, password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!data.success) {
        toast.error(data.error || (isRtl ? 'فشل العملية' : 'Operation failed'))
        setLoading(false)
        return
      }

      // Login successful
      if (data.data?.user) {
        login(data.data.user)
        toast.success(isRtl ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!')
        // Fetch fresh data after a short delay
        setTimeout(() => {
          useAppStore.getState().fetchCurrentUser()
        }, 500)
      }
      setLoading(false)
    } catch (err: any) {
      toast.error(err.message || 'Network error')
      setLoading(false)
    }
  }

  const handleOtpChange = (idx: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[idx] = value
    setOtp(newOtp)
    if (value && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`)
      nextInput?.focus()
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    // For demo: any 6-digit code works
    setTimeout(() => {
      setLoading(false)
      login({
        id: 'user-001',
        name: name || 'User',
        email: email || 'user@example.com',
        avatar: '',
        balance: 25,
        totalProfit: 0,
        dailyProfit: 0,
        monthlyProfit: 0,
        referrals: 0,
        activePlan: null,
        joinedAt: new Date().toISOString(),
        isAdmin: false,
        vipLevel: 1,
        points: 0,
      })
      toast.success(lang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!')
    }, 800)
  }

  const handleSocialLogin = async (provider: string) => {
    setLoading(true)
    try {
      // In production, redirect to OAuth provider
      // For now, show message
      toast.info(isRtl
        ? `سيتم توجيهك إلى ${provider} لإكمال تسجيل الدخول`
        : `You will be redirected to ${provider} to complete sign in`
      )
      setLoading(false)
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  const isRtl = lang === 'ar'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-luxury"
        >
          <div className="relative glass rounded-3xl border-white/10 overflow-hidden">
            {/* Background effects */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#00d4ff]/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#9d4edd]/20 blur-3xl" />

            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 end-4 z-20 w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative p-8" dir={isRtl ? 'rtl' : 'ltr'}>
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-6">
                <Logo size={56} />
                <h2 className="text-2xl font-bold mt-4 mb-1">
                  {authStage === 'login' && (isRtl ? 'مرحباً بعودتك' : 'Welcome Back')}
                  {authStage === 'register' && (isRtl ? 'إنشاء حساب جديد' : 'Create Account')}
                  {authStage === 'forgot' && (isRtl ? 'استعادة كلمة المرور' : 'Reset Password')}
                  {authStage === 'otp' && (isRtl ? 'أدخل رمز التحقق' : 'Enter Verification Code')}
                  {authStage === 'twofa' && (isRtl ? 'المصادقة الثنائية' : 'Two-Factor Auth')}
                </h2>
                {authStage === 'login' && (
                  <p className="text-sm text-muted-foreground">
                    {isRtl ? 'سعداء برؤيتك مرة أخرى!' : 'Happy to see you again!'}
                  </p>
                )}
                {authStage === 'register' && (
                  <p className="text-sm text-muted-foreground">
                    {isRtl ? 'ابدأ رحلتك الاستثمارية اليوم' : 'Start your investment journey today'}
                  </p>
                )}
                {authStage === 'forgot' && (
                  <p className="text-sm text-muted-foreground">
                    {isRtl ? 'أدخل بريدك وسنرسل رابط الاستعادة' : 'Enter your email and we will send a reset link'}
                  </p>
                )}
                {authStage === 'otp' && (
                  <p className="text-sm text-muted-foreground">
                    {isRtl ? 'أرسلنا رمزاً من 6 أرقام إلى' : 'We sent a 6-digit code to'} <span className="text-[#00d4ff] font-medium">{email || 'your email'}</span>
                  </p>
                )}
                {authStage === 'twofa' && (
                  <p className="text-sm text-muted-foreground">
                    {isRtl ? 'أدخل الرمز من تطبيق المصادقة' : 'Enter the code from your authenticator app'}
                  </p>
                )}
              </div>

              {/* Forgot password form */}
              {authStage === 'forgot' && (
                <form onSubmit={(e) => { e.preventDefault(); toast.success(isRtl ? 'تم إرسال رابط الاستعادة!' : 'Reset link sent!'); close(); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{isRtl ? 'البريد الإلكتروني' : 'Email'}</Label>
                    <div className="relative">
                      <Mail className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        required
                        placeholder={isRtl ? 'you@example.com' : 'you@example.com'}
                        className="ps-10 bg-white/5"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0">
                    {isRtl ? 'إرسال الرابط' : 'Send Reset Link'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setAuthStage('login')}
                    className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
                  >
                    {isRtl ? <ArrowRight className="h-3 w-3" /> : <ArrowLeft className="h-3 w-3" />}
                    {isRtl ? 'العودة لتسجيل الدخول' : 'Back to login'}
                  </button>
                </form>
              )}

              {/* OTP / 2FA form */}
              {(authStage === 'otp' || authStage === 'twofa') && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/30">
                    <ShieldCheck className="h-8 w-8 text-[#00d4ff]" />
                  </div>

                  <div className="flex items-center justify-between gap-2" dir="ltr">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-12 h-14 text-center text-xl font-bold rounded-xl glass border-white/10 focus:border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/30"
                      />
                    ))}
                  </div>

                  <Button
                    onClick={handleVerify}
                    disabled={loading || otp.some(d => !d)}
                    className="w-full h-11 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-4 w-4 me-2" />
                        {isRtl ? 'تحقق' : 'Verify'}
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    {countdown > 0 ? (
                      <span>
                        {isRtl ? 'إعادة الإرسال خلال' : 'Resend in'} {countdown}s
                      </span>
                    ) : (
                      <button
                        onClick={() => { setCountdown(45); toast.success(isRtl ? 'تم إرسال رمز جديد' : 'New code sent'); }}
                        className="text-[#00d4ff] hover:underline font-medium"
                      >
                        {isRtl ? 'إعادة إرسال الرمز' : 'Resend code'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Login / Register form */}
              {(authStage === 'login' || authStage === 'register') && (
                <>
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    {authStage === 'register' && (
                      <div className="space-y-2">
                        <Label>{isRtl ? 'الاسم الكامل' : 'Full Name'}</Label>
                        <div className="relative">
                          <User className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            required
                            placeholder={isRtl ? 'أحمد محمد' : 'John Doe'}
                            className="ps-10 bg-white/5"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    {authStage === 'register' && (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1.5">
                          {isRtl ? 'رمز الدعوة' : 'Referral Code'}
                          <span className="text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/10">{isRtl ? 'إجباري' : 'REQUIRED'}</span>
                        </Label>
                        <div className="relative">
                          <KeyRound className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-[#ffd700]" />
                          <Input
                            required
                            placeholder={isRtl ? 'ADMIN001 أو رمز دعوة من صديق' : 'ADMIN001 or friend\'s code'}
                            className="ps-10 bg-white/5 font-mono uppercase"
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {isRtl ? '📝 لا يمكن إنشاء حساب بدون رمز دعوة. استخدم ADMIN001 إذا لم يكن لديك واحد.' : '📝 Cannot register without a referral code. Use ADMIN001 if you don\'t have one.'}
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>{isRtl ? 'البريد الإلكتروني' : 'Email'}</Label>
                      <div className="relative">
                        <Mail className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          required
                          placeholder="you@example.com"
                          className="ps-10 bg-white/5"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>{isRtl ? 'كلمة المرور' : 'Password'}</Label>
                        {authStage === 'login' && (
                          <button
                            type="button"
                            onClick={() => setAuthStage('forgot')}
                            className="text-xs text-[#00d4ff] hover:underline"
                          >
                            {isRtl ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          className="ps-10 pe-10 bg-white/5"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {authStage === 'register' && (
                      <div className="flex items-center gap-2">
                        <Checkbox id="terms" required />
                        <Label htmlFor="terms" className="text-xs font-normal text-muted-foreground cursor-pointer">
                          {isRtl ? 'أوافق على ' : 'I agree to the '}
                          <span className="text-[#00d4ff]">{isRtl ? 'الشروط والأحكام' : 'Terms & Conditions'}</span>
                        </Label>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0 glow-electric"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          {authStage === 'login' ? (isRtl ? 'تسجيل الدخول' : 'Sign In') : (isRtl ? 'إنشاء الحساب' : 'Create Account')}
                          <ArrowRight className="h-4 w-4 ms-2 rtl:rotate-180" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-transparent px-3 text-muted-foreground glass">
                        {isRtl ? 'أو سجل عبر' : 'OR CONTINUE WITH'}
                      </span>
                    </div>
                  </div>

                  {/* Social buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleSocialLogin('google')}
                      disabled={loading}
                      className="h-11 rounded-xl glass border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleSocialLogin('telegram')}
                      disabled={loading}
                      className="h-11 rounded-xl glass border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#29a9ea">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleSocialLogin('apple')}
                      disabled={loading}
                      className="h-11 rounded-xl glass border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 12.04c-.03-2.16 1.76-3.2 1.84-3.25-1-1.47-2.56-1.67-3.12-1.7-1.33-.13-2.6.78-3.27.78-.67 0-1.71-.76-2.81-.74-1.45.02-2.78.84-3.52 2.13-1.5 2.6-.38 6.45 1.08 8.56.71 1.04 1.55 2.2 2.65 2.16 1.07-.04 1.47-.69 2.76-.69 1.29 0 1.65.69 2.78.67 1.15-.02 1.87-1.05 2.57-2.09.81-1.19 1.14-2.35 1.16-2.41-.03-.01-2.22-.85-2.25-3.38zM14.86 5.6c.59-.71.99-1.7.88-2.69-.85.03-1.88.57-2.49 1.28-.55.63-1.03 1.64-.9 2.61.95.07 1.92-.48 2.51-1.2z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Switch */}
                  <div className="text-center text-sm text-muted-foreground mt-6">
                    {authStage === 'login' ? (
                      <>
                        {isRtl ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
                        <button
                          onClick={() => setAuthStage('register')}
                          className="text-[#00d4ff] hover:underline font-medium"
                        >
                          {isRtl ? 'تسجيل' : 'Sign Up'}
                        </button>
                      </>
                    ) : (
                      <>
                        {isRtl ? 'لديك حساب؟ ' : 'Already have an account? '}
                        <button
                          onClick={() => setAuthStage('login')}
                          className="text-[#00d4ff] hover:underline font-medium"
                        >
                          {isRtl ? 'دخول' : 'Sign In'}
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
