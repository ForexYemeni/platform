import { db } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/auth'

// Public API - get landing page content (no auth required)
export async function GET() {
  try {
    if (!db) {
      // Return defaults if no database
      return apiSuccess({
        content: {
          heroBadge: 'The #1 Investment Platform of 2026',
          heroTitle1: 'The Future of',
          heroTitle2: 'Crypto Mining',
          heroSubtitle: 'A luxury investment platform combining advanced mining technology with institutional-grade security. Start your journey to financial freedom today with daily returns up to 5%.',
          heroBadgeAr: 'منصة الاستثمار رقم 1 لعام 2026',
          heroTitle1Ar: 'مستقبل التعدين',
          heroTitle2Ar: 'العملات الرقمية',
          heroSubtitleAr: 'منصة استثمار فاخرة تجمع بين تقنيات التعدين المتقدمة وأمان مؤسسي. ابدأ رحلتك نحو الحرية المالية اليوم مع عوائد يومية تصل إلى 5%.',
          ctaTitle: 'Ready to Start Your Journey?',
          ctaTitleAr: 'جاهز لبدء رحلتك؟',
          ctaSubtitle: 'Join today and get a $25 welcome bonus, 7-day free Basic plan, and entry into monthly $50,000 giveaways.',
          ctaSubtitleAr: 'انضم اليوم واحصل على مكافأة ترحيب 25$، خطة أساسية مجانية لمدة 7 أيام، ودخول في سحوبات شهرية بقيمة 50,000$.',
          statInvestors: '250,000+',
          statVolume: '$48M+',
          statCountries: '120+',
          statUptime: '99.98%',
        }
      })
    }

    const settings = await db.adminSettings.findUnique({ where: { id: 'singleton' } })

    if (!settings) {
      return apiSuccess({ content: null })
    }

    return apiSuccess({
      content: {
        heroBadge: settings.heroBadge,
        heroTitle1: settings.heroTitle1,
        heroTitle2: settings.heroTitle2,
        heroSubtitle: settings.heroSubtitle,
        heroBadgeAr: settings.heroBadgeAr,
        heroTitle1Ar: settings.heroTitle1Ar,
        heroTitle2Ar: settings.heroTitle2Ar,
        heroSubtitleAr: settings.heroSubtitleAr,
        ctaTitle: settings.ctaTitle,
        ctaTitleAr: settings.ctaTitleAr,
        ctaSubtitle: settings.ctaSubtitle,
        ctaSubtitleAr: settings.ctaSubtitleAr,
        statInvestors: settings.statInvestors,
        statVolume: settings.statVolume,
        statCountries: settings.statCountries,
        statUptime: settings.statUptime,
      }
    })
  } catch (e: any) {
    return apiError(e.message, 500)
  }
}
