import { PrismaClient } from '@prisma/client'

const DATABASE_URL = 'postgresql://neondb_owner:npg_VkIEZ8ON5dJx@ep-bold-union-atmkdz76-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'
const db = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } })

async function main() {
  console.log('🔧 Adding landing page content columns...')

  const cols = [
    ['heroBadge', "TEXT NOT NULL DEFAULT 'The #1 Investment Platform of 2026'"],
    ['heroTitle1', "TEXT NOT NULL DEFAULT 'The Future of'"],
    ['heroTitle2', "TEXT NOT NULL DEFAULT 'Crypto Mining'"],
    ['heroSubtitle', "TEXT NOT NULL DEFAULT 'A luxury investment platform combining advanced mining technology with institutional-grade security.'"],
    ['heroBadgeAr', "TEXT NOT NULL DEFAULT 'منصة الاستثمار رقم 1 لعام 2026'"],
    ['heroTitle1Ar', "TEXT NOT NULL DEFAULT 'مستقبل التعدين'"],
    ['heroTitle2Ar', "TEXT NOT NULL DEFAULT 'العملات الرقمية'"],
    ['heroSubtitleAr', "TEXT NOT NULL DEFAULT 'منصة استثمار فاخرة تجمع بين تقنيات التعدين المتقدمة وأمان مؤسسي.'"],
    ['ctaTitle', "TEXT NOT NULL DEFAULT 'Ready to Start Your Journey?'"],
    ['ctaTitleAr', "TEXT NOT NULL DEFAULT 'جاهز لبدء رحلتك؟'"],
    ['ctaSubtitle', "TEXT NOT NULL DEFAULT 'Join today and get a welcome bonus.'"],
    ['ctaSubtitleAr', "TEXT NOT NULL DEFAULT 'انضم اليوم واحصل على مكافأة ترحيب.'"],
    ['statInvestors', "TEXT NOT NULL DEFAULT '250,000+'"],
    ['statVolume', "TEXT NOT NULL DEFAULT '$48M+'"],
    ['statCountries', "TEXT NOT NULL DEFAULT '120+'"],
    ['statUptime', "TEXT NOT NULL DEFAULT '99.98%'"],
  ]

  for (const [col, def] of cols) {
    try {
      await db.$executeRawUnsafe(`ALTER TABLE "AdminSettings" ADD COLUMN IF NOT EXISTS "${col}" ${def}`)
      console.log(`✅ ${col}`)
    } catch (e: any) {
      console.error(`❌ ${col}: ${e.message.substring(0, 60)}`)
    }
  }

  console.log('\n🎉 Landing content columns added!')
  await db.$disconnect()
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
