import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ============================================
  // Create Admin User
  // ============================================
  const adminPasswordHash = await hashPasswordSimple('admin123')
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cryptomine.io' },
    update: {},
    create: {
      name: 'Platform Admin',
      email: 'admin@cryptomine.io',
      passwordHash: adminPasswordHash,
      referralCode: 'ADMIN001',
      isAdmin: true,
      role: 'ADMIN',
      balance: 999999,
      vipLevel: 5,
      emailVerified: true,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // ============================================
  // Create Mining Plans
  // ============================================
  const plans = [
    {
      name: 'Basic',
      nameAr: 'الأساسية',
      investment: 50,
      dailyProfit: 2,
      duration: 30,
      hashrate: '0.5 TH/s',
      color: '#10b981',
      gradient: 'from-emerald-500 to-teal-600',
      icon: 'bronze',
      popular: false,
      features: [
        { ar: 'ربح يومي 2%', en: '2% daily profit' },
        { ar: 'سحب فوري', en: 'Instant withdrawal' },
        { ar: 'دعم عبر البريد', en: 'Email support' },
      ],
    },
    {
      name: 'Silver',
      nameAr: 'الفضية',
      investment: 200,
      dailyProfit: 3,
      duration: 45,
      hashrate: '2.0 TH/s',
      color: '#94a3b8',
      gradient: 'from-slate-400 to-slate-600',
      icon: 'silver',
      popular: false,
      features: [
        { ar: 'ربح يومي 3%', en: '3% daily profit' },
        { ar: 'سحب فوري', en: 'Instant withdrawal' },
        { ar: 'إعادة استثمار تلقائي', en: 'Auto-reinvest' },
        { ar: 'دعم أولوية', en: 'Priority support' },
      ],
    },
    {
      name: 'Gold',
      nameAr: 'الذهبية',
      investment: 500,
      dailyProfit: 4,
      duration: 60,
      hashrate: '5.0 TH/s',
      color: '#f59e0b',
      gradient: 'from-amber-400 to-yellow-600',
      icon: 'gold',
      popular: true,
      features: [
        { ar: 'ربح يومي 4%', en: '4% daily profit' },
        { ar: 'سحب فوري 24/7', en: '24/7 instant withdrawal' },
        { ar: 'إعادة استثمار تلقائي', en: 'Auto-reinvest' },
        { ar: 'دعم VIP مخصص', en: 'Dedicated VIP support' },
        { ar: 'مكافأة إحالة مضاعفة', en: '2x referral bonus' },
      ],
    },
    {
      name: 'Diamond',
      nameAr: 'الماسية',
      investment: 1000,
      dailyProfit: 5,
      duration: 90,
      hashrate: '15.0 TH/s',
      color: '#a855f7',
      gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
      icon: 'diamond',
      popular: false,
      features: [
        { ar: 'ربح يومي 5%', en: '5% daily profit' },
        { ar: 'سحب فوري بدون حدود', en: 'No-limit instant withdrawal' },
        { ar: 'إعادة استثمار تلقائي', en: 'Auto-reinvest' },
        { ar: 'مدير حساب خاص', en: 'Personal account manager' },
        { ar: 'مكافأة إحالة ثلاثية', en: '3x referral bonus' },
        { ar: 'هدايا حصرية', en: 'Exclusive gifts' },
      ],
    },
  ]

  for (const plan of plans) {
    const created = await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    })
    console.log('✅ Plan created:', created.name)
  }

  // ============================================
  // Create Tasks
  // ============================================
  const tasks = [
    {
      title: 'Daily Check-in',
      titleAr: 'تسجيل الدخول اليومي',
      description: 'Log in today and claim your reward',
      descriptionAr: 'سجل دخولك ليومك واحصل على المكافأة',
      type: 'DAILY',
      reward: 1,
      rewardType: 'USDT',
      icon: '📅',
    },
    {
      title: 'Watch Tutorial Video',
      titleAr: 'شاهد فيديو تعليمي',
      description: 'Watch a 2-min video on mining strategies',
      descriptionAr: 'شاهد فيديو مدته دقيقتان عن استراتيجيات التعدين',
      type: 'DAILY',
      reward: 2.5,
      rewardType: 'USDT',
      icon: '🎬',
    },
    {
      title: 'Follow us on X',
      titleAr: 'تابعنا على X',
      description: 'Follow our official account on X',
      descriptionAr: 'تابع حسابنا الرسمي على منصة X',
      type: 'DAILY',
      reward: 50,
      rewardType: 'POINTS',
      icon: '𝕏',
    },
    {
      title: 'Invite 1 friend',
      titleAr: 'ادعُ صديقاً واحداً',
      description: 'Share your link and invite 1 friend to sign up',
      descriptionAr: 'شارك رابطك وادعُ صديقاً واحداً للتسجيل',
      type: 'DAILY',
      reward: 5,
      rewardType: 'USDT',
      icon: '👥',
      total: 1,
    },
    {
      title: 'Share link on social media',
      titleAr: 'شارك الرابط على وسائل التواصل',
      description: 'Post your referral link on any social platform',
      descriptionAr: 'انشر رابط الإحالة على أي منصة تواصل اجتماعي',
      type: 'DAILY',
      reward: 1.5,
      rewardType: 'USDT',
      icon: '🔗',
    },
    {
      title: 'Invite 5 friends',
      titleAr: 'ادعُ 5 أصدقاء',
      description: 'Invite 5 new friends this week',
      descriptionAr: 'ادعُ 5 أصدقاء جدد هذا الأسبوع',
      type: 'WEEKLY',
      reward: 50,
      rewardType: 'USDT',
      icon: '🎯',
      total: 5,
    },
    {
      title: 'Invest $1000 this week',
      titleAr: 'استثمر 1000$ هذا الأسبوع',
      description: 'Reach $1000 weekly investment volume',
      descriptionAr: 'حقق حجم استثمار أسبوعي بقيمة 1000$',
      type: 'WEEKLY',
      reward: 500,
      rewardType: 'POINTS',
      icon: '💰',
      total: 1000,
    },
    {
      title: 'Upgrade to Gold VIP',
      titleAr: 'الترقية إلى VIP الذهبي',
      description: 'Invest in the Gold plan for the first time',
      descriptionAr: 'استثمر في الخطة الذهبية لأول مرة',
      type: 'SPECIAL',
      reward: 25,
      rewardType: 'USDT',
      icon: '👑',
    },
  ]

  for (const task of tasks) {
    const created = await prisma.task.upsert({
      where: { title: task.title },
      update: task,
      create: task,
    })
    console.log('✅ Task created:', created.title)
  }

  // ============================================
  // Create Admin Settings
  // ============================================
  await prisma.adminSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  })
  console.log('✅ Admin settings created')

  // ============================================
  // Create Demo User (for testing)
  // ============================================
  const demoPasswordHash = await hashPasswordSimple('demo123')
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@cryptomine.io' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@cryptomine.io',
      passwordHash: demoPasswordHash,
      referralCode: 'DEMO001',
      balance: 4520.50,
      totalProfit: 1820.75,
      dailyProfit: 20.0,
      monthlyProfit: 600.0,
      vipLevel: 2,
      points: 1250,
      emailVerified: true,
    },
  })
  console.log('✅ Demo user created:', demoUser.email)

  console.log('\n🎉 Seeding completed!')
  console.log('\n📋 Login credentials:')
  console.log('   Admin: admin@cryptomine.io / admin123')
  console.log('   Demo:  demo@cryptomine.io / demo123')
}

// Simple SHA-256 hash (same as auth.ts)
async function hashPasswordSimple(password: string): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback-secret-change-me'
  const encoder = new TextEncoder()
  const data = encoder.encode(password + secret)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
