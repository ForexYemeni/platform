'use client'

import { motion } from 'framer-motion'
import { Twitter, Send, Github, Mail, MessageCircle, MapPin } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Logo } from './logo'

export function Footer() {
  const { lang, setView, setAuthStage } = useAppStore()

  const quickLinks = [
    { label: lang === 'ar' ? 'الرئيسية' : 'Home', view: 'home' as const },
    { label: lang === 'ar' ? 'خطط الاستثمار' : 'Investment Plans', view: 'plans' as const },
    { label: lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', view: 'faq' as const },
    { label: lang === 'ar' ? 'أخبار العملات' : 'Crypto News', view: 'news' as const },
  ]

  const legal = [
    { label: lang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions', view: 'terms' as const },
    { label: lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', view: 'privacy' as const },
    { label: lang === 'ar' ? 'إخلاء المسؤولية' : 'Risk Disclosure', view: 'terms' as const },
  ]

  return (
    <footer className="relative mt-auto border-t border-border bg-gradient-to-b from-transparent to-black/20">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size={44} />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {lang === 'ar'
                ? 'منصة التعدين والاستثمار الرائدة عالمياً، نوفر أفضل عوائد الاستثمار بأعلى معايير الأمان والشفافية.'
                : 'The world-leading mining and investment platform, providing the best returns with the highest security and transparency standards.'}
            </p>
            <div className="flex items-center gap-2">
              {[Twitter, Send, MessageCircle, Mail, Github].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[#00d4ff]/50 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => setView(link.view)}
                    className="text-sm text-muted-foreground hover:text-[#00d4ff] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              {lang === 'ar' ? 'قانوني' : 'Legal'}
            </h4>
            <ul className="space-y-2.5">
              {legal.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => setView(link.view)}
                    className="text-sm text-muted-foreground hover:text-[#00d4ff] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setAuthStage('register')}
                  className="text-sm text-muted-foreground hover:text-[#00d4ff] transition-colors"
                >
                  {lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              {lang === 'ar' ? 'الدعم' : 'Support'}
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#00d4ff]" />
                <span>support@cryptomine.io</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[#00d4ff]" />
                <span>Live Chat 24/7</span>
              </li>
              <li className="flex items-center gap-2">
                <Send className="h-4 w-4 text-[#00d4ff]" />
                <span>@CryptoMineBot</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#00d4ff]" />
                <span>Dubai, UAE • Singapore</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 p-4 rounded-xl glass border-amber-500/20 bg-amber-500/5">
          <p className="text-xs text-amber-200/80 leading-relaxed">
            ⚠️ {lang === 'ar'
              ? 'تحذير المخاطر: ينطوي الاستثمار في العملات الرقمية على مخاطر، يرجى الاستثمار بما يمكنك تحمل خسارته. الأداء السابق لا يضمن النتائج المستقبلية.'
              : 'Risk warning: Cryptocurrency investment involves risk, please invest only what you can afford to lose. Past performance does not guarantee future results.'}
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 CryptoMine Investment Platform. {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {lang === 'ar' ? 'الأنظمة تعمل' : 'Systems operational'}
            </span>
            <span>SSL Secured</span>
            <span>PCI DSS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
