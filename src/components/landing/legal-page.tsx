'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, FileText, Shield } from 'lucide-react'
import { useAppStore, type View } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function LegalPage({ type }: { type: 'terms' | 'privacy' }) {
  const { lang, setView } = useAppStore()
  const isRtl = lang === 'ar'
  const isTerms = type === 'terms'

  const content = isTerms ? {
    title: isRtl ? 'الشروط والأحكام' : 'Terms & Conditions',
    icon: FileText,
    sections: isRtl ? [
      { title: '1. قبول الشروط', body: 'باستخدامك لمنصة CryptoMine، فإنك توافق على هذه الشروط والأحكام كاملة. إذا كنت لا توافق على أي جزء، يرجى عدم استخدام المنصة.' },
      { title: '2. الأهلية', body: 'يجب أن يكون عمرك 18 عاماً على الأقل وأن تكون قادراً قانونياً على إبرام العقود. أنت مسؤول عن توفير معلومات دقيقة عند التسجيل.' },
      { title: '3. الاستثمار والمخاطر', body: 'الاستثمار في العملات الرقمية ينطوي على مخاطر كبيرة. الأرباح اليومية المعلنة ليست مضمونة وقد تختلف بناءً على ظروف السوق. استثمر فقط بما يمكنك تحمل خسارته.' },
      { title: '4. الحسابات والأمان', body: 'أنت مسؤول عن الحفاظ على سرية بيانات حسابك وكلمة المرور. المنصة غير مسؤولة عن أي خسارة ناتجة عن إفصاح غير مصرح به عن بياناتك.' },
      { title: '5. الإيداعات والسحوبات', body: 'الحد الأدنى للإيداع يختلف حسب العملة. تتم معالجة السحوبات خلال 5-30 دقيقة. رسوم السحب معروضة بشفافية لكل عملة وشبكة.' },
      { title: '6. نظام الإحالات', body: 'العمولات تُدفع على 3 مستويات: 10% للمستوى الأول، 5% للثاني، 2% للثالث. العمولات مدى الحياة وتُحتسب تلقائياً.' },
      { title: '7. الحظر والتعليق', body: 'تحتفظ المنصة بحق حظر أو تعليق أي حساب يخالف الشروط أو يشتبه في نشاط احتيالي دون إشعار مسبق.' },
      { title: '8. التعديلات', body: 'قد تُعدل هذه الشروط من حين لآخر. استمرارك في استخدام المنصة بعد التعديلات يعني موافقتك على الشروط المحدثة.' },
    ] : [
      { title: '1. Acceptance of Terms', body: 'By using CryptoMine platform, you agree to these Terms & Conditions in full. If you do not agree with any part, please do not use the platform.' },
      { title: '2. Eligibility', body: 'You must be at least 18 years old and legally capable of entering into contracts. You are responsible for providing accurate information during registration.' },
      { title: '3. Investment & Risk', body: 'Cryptocurrency investment carries significant risks. Advertised daily returns are not guaranteed and may vary based on market conditions. Invest only what you can afford to lose.' },
      { title: '4. Accounts & Security', body: 'You are responsible for maintaining the confidentiality of your account credentials. The platform is not liable for losses from unauthorized disclosure of your information.' },
      { title: '5. Deposits & Withdrawals', body: 'Minimum deposit varies by currency. Withdrawals are processed within 5-30 minutes. Withdrawal fees are transparently displayed for each currency and network.' },
      { title: '6. Referral System', body: 'Commissions are paid across 3 tiers: 10% Level 1, 5% Level 2, 2% Level 3. Commissions are lifetime and calculated automatically.' },
      { title: '7. Suspension & Ban', body: 'The platform reserves the right to ban or suspend any account that violates these terms or is suspected of fraudulent activity without prior notice.' },
      { title: '8. Modifications', body: 'These terms may be modified from time to time. Continued use of the platform after modifications constitutes acceptance of the updated terms.' },
    ]
  } : {
    title: isRtl ? 'سياسة الخصوصية' : 'Privacy Policy',
    icon: Shield,
    sections: isRtl ? [
      { title: '1. جمع المعلومات', body: 'نجمع معلومات شخصية مثل الاسم، البريد الإلكتروني، عنوان IP، وسجلات المعاملات. لا نطلب معلومات حساسة غير ضرورية.' },
      { title: '2. استخدام المعلومات', body: 'نستخدم معلوماتك لتشغيل المنصة، معالجة المعاملات، تحسين الخدمات، التواصل معك، والامتثال للمتطلبات القانونية.' },
      { title: '3. حماية البيانات', body: 'نستخدم تشفير AES-256، مصادقة ثنائية، تخزين بارد لـ 95% من الأصول، حماية DDoS، ومراجعات أمنية دورية من شركات مستقلة.' },
      { title: '4. مشاركة المعلومات', body: 'لا نبيع بياناتك أبداً. قد نشاركها فقط مع مزودي الخدمات الموثوقين أو عند الضرورة القانونية مع السلطات المختصة.' },
      { title: '5. ملفات تعريف الارتباط', body: 'نستخدم cookies لتحسين تجربتك، تذكر تفضيلاتك، وتحليل أداء المنصة. يمكنك التحكم في cookies من إعدادات متصفحك.' },
      { title: '6. حقوقك', body: 'لديك حق الوصول إلى بياناتك، تصحيحها، حذفها، أو تصديرها. يمكنك أيضاً إلغاء الاشتراك في الاتصالات التسويقية في أي وقت.' },
      { title: '7. الاحتفاظ بالبيانات', body: 'نحتفظ ببياناتك طوال مدة نشاط حسابك. عند الإغلاق، قد نحتفظ ببعض البيانات للامتثال القانوني لمدة تصل إلى 7 سنوات.' },
      { title: '8. الاتصال بنا', body: 'لأي استفسارات حول الخصوصية، تواصل معنا على privacy@cryptomine.io. سنرد خلال 48 ساعة.' },
    ] : [
      { title: '1. Information Collection', body: 'We collect personal information such as name, email, IP address, and transaction logs. We do not request unnecessary sensitive information.' },
      { title: '2. Information Use', body: 'We use your information to operate the platform, process transactions, improve services, communicate with you, and comply with legal requirements.' },
      { title: '3. Data Protection', body: 'We use AES-256 encryption, 2FA, cold storage for 95% of assets, DDoS protection, and regular independent security audits.' },
      { title: '4. Information Sharing', body: 'We never sell your data. We may share it only with trusted service providers or when legally required with proper authorities.' },
      { title: '5. Cookies', body: 'We use cookies to improve your experience, remember preferences, and analyze platform performance. You can control cookies in your browser settings.' },
      { title: '6. Your Rights', body: 'You have the right to access, correct, delete, or export your data. You can also unsubscribe from marketing communications at any time.' },
      { title: '7. Data Retention', body: 'We retain your data for as long as your account is active. Upon closure, we may retain some data for legal compliance for up to 7 years.' },
      { title: '8. Contact Us', body: 'For any privacy inquiries, contact us at privacy@cryptomine.io. We will respond within 48 hours.' },
    ]
  }

  return (
    <div className="py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Button variant="ghost" onClick={() => setView('home')} className="mb-4">
            <ArrowLeft className="h-4 w-4 me-2 rtl:rotate-180" />
            {isRtl ? 'العودة' : 'Back'}
          </Button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d4ff]/20 to-[#9d4edd]/20 mb-4">
            <content.icon className="h-8 w-8 text-[#00d4ff]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-2">{content.title}</h1>
          <p className="text-sm text-muted-foreground">آخر تحديث: يوليو 2026</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="p-6 md:p-8 glass border-white/5 space-y-6">
            {content.sections.map((section, i) => (
              <div key={i}>
                <h2 className="font-bold text-lg mb-2 text-gradient-electric">{section.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
              </div>
            ))}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
