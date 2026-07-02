// Mock data for the platform

export interface MiningPlan {
  id: string
  nameKey: string
  investment: number
  dailyProfit: number // percentage
  duration: number // days
  color: string
  gradient: string
  popular?: boolean
  features: { ar: string; en: string }[]
  hashrate: string
  icon: string
}

export const miningPlans: MiningPlan[] = [
  {
    id: 'basic',
    nameKey: 'basic',
    investment: 50,
    dailyProfit: 2,
    duration: 30,
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    hashrate: '0.5 TH/s',
    icon: 'bronze',
    features: [
      { ar: 'ربح يومي 2%', en: '2% daily profit' },
      { ar: 'سحب فوري', en: 'Instant withdrawal' },
      { ar: 'دعم عبر البريد', en: 'Email support' },
    ],
  },
  {
    id: 'silver',
    nameKey: 'silver',
    investment: 200,
    dailyProfit: 3,
    duration: 45,
    color: '#94a3b8',
    gradient: 'from-slate-400 to-slate-600',
    hashrate: '2.0 TH/s',
    icon: 'silver',
    features: [
      { ar: 'ربح يومي 3%', en: '3% daily profit' },
      { ar: 'سحب فوري', en: 'Instant withdrawal' },
      { ar: 'إعادة استثمار تلقائي', en: 'Auto-reinvest' },
      { ar: 'دعم أولوية', en: 'Priority support' },
    ],
  },
  {
    id: 'gold',
    nameKey: 'gold',
    investment: 500,
    dailyProfit: 4,
    duration: 60,
    color: '#f59e0b',
    gradient: 'from-amber-400 to-yellow-600',
    popular: true,
    hashrate: '5.0 TH/s',
    icon: 'gold',
    features: [
      { ar: 'ربح يومي 4%', en: '4% daily profit' },
      { ar: 'سحب فوري 24/7', en: '24/7 instant withdrawal' },
      { ar: 'إعادة استثمار تلقائي', en: 'Auto-reinvest' },
      { ar: 'دعم VIP مخصص', en: 'Dedicated VIP support' },
      { ar: 'مكافأة إحالة مضاعفة', en: '2x referral bonus' },
    ],
  },
  {
    id: 'diamond',
    nameKey: 'diamond',
    investment: 1000,
    dailyProfit: 5,
    duration: 90,
    color: '#a855f7',
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
    hashrate: '15.0 TH/s',
    icon: 'diamond',
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

export interface CryptoCurrency {
  id: string
  name: string
  symbol: string
  network: string
  icon: string
  color: string
  minDeposit: number
  minWithdraw: number
  withdrawFee: number
  address: string
  price: number
  change24h: number
}

export const cryptos: CryptoCurrency[] = [
  {
    id: 'usdt-trc20',
    name: 'USDT (TRC20)',
    symbol: 'USDT',
    network: 'TRC20',
    icon: '₮',
    color: '#26a17b',
    minDeposit: 10,
    minWithdraw: 20,
    withdrawFee: 1,
    address: '',
    price: 1.0,
    change24h: 0.01,
  },
  {
    id: 'usdt-erc20',
    name: 'USDT (ERC20)',
    symbol: 'USDT',
    network: 'ERC20',
    icon: '₮',
    color: '#26a17b',
    minDeposit: 10,
    minWithdraw: 20,
    withdrawFee: 5,
    address: '',
    price: 1.0,
    change24h: 0.01,
  },
  {
    id: 'usdt-bep20',
    name: 'USDT (BEP20)',
    symbol: 'USDT',
    network: 'BEP20',
    icon: '₮',
    color: '#26a17b',
    minDeposit: 10,
    minWithdraw: 20,
    withdrawFee: 0.5,
    address: '',
    price: 1.0,
    change24h: 0.01,
  },
  {
    id: 'usdt-sol',
    name: 'USDT (Solana)',
    symbol: 'USDT',
    network: 'Solana',
    icon: '₮',
    color: '#26a17b',
    minDeposit: 10,
    minWithdraw: 20,
    withdrawFee: 0.1,
    address: '',
    price: 1.0,
    change24h: 0.01,
  },
  {
    id: 'usdt-polygon',
    name: 'USDT (Polygon)',
    symbol: 'USDT',
    network: 'Polygon',
    icon: '₮',
    color: '#26a17b',
    minDeposit: 10,
    minWithdraw: 20,
    withdrawFee: 0.5,
    address: '',
    price: 1.0,
    change24h: 0.01,
  },
  {
    id: 'usdt-arb',
    name: 'USDT (Arbitrum)',
    symbol: 'USDT',
    network: 'Arbitrum One',
    icon: '₮',
    color: '#26a17b',
    minDeposit: 10,
    minWithdraw: 20,
    withdrawFee: 0.3,
    address: '',
    price: 1.0,
    change24h: 0.01,
  },
  {
    id: 'usdt-op',
    name: 'USDT (Optimism)',
    symbol: 'USDT',
    network: 'Optimism',
    icon: '₮',
    color: '#26a17b',
    minDeposit: 10,
    minWithdraw: 20,
    withdrawFee: 0.3,
    address: '',
    price: 1.0,
    change24h: 0.01,
  },
  {
    id: 'usdt-avax',
    name: 'USDT (Avalanche)',
    symbol: 'USDT',
    network: 'Avalanche C-Chain',
    icon: '₮',
    color: '#26a17b',
    minDeposit: 10,
    minWithdraw: 20,
    withdrawFee: 0.5,
    address: '',
    price: 1.0,
    change24h: 0.01,
  },
]

export interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'profit' | 'referral' | 'task' | 'bonus'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'rejected'
  date: string
  txHash?: string
}

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-001',
    type: 'profit',
    amount: 20.0,
    currency: 'USDT',
    status: 'completed',
    date: '2026-07-02 14:30',
  },
  {
    id: 'tx-002',
    type: 'deposit',
    amount: 0.0052,
    currency: 'BTC',
    status: 'completed',
    date: '2026-07-02 09:15',
    txHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
  },
  {
    id: 'tx-003',
    type: 'referral',
    amount: 15.5,
    currency: 'USDT',
    status: 'completed',
    date: '2026-07-01 22:00',
  },
  {
    id: 'tx-004',
    type: 'withdrawal',
    amount: 250.0,
    currency: 'USDT',
    status: 'pending',
    date: '2026-07-01 18:45',
  },
  {
    id: 'tx-005',
    type: 'task',
    amount: 2.5,
    currency: 'USDT',
    status: 'completed',
    date: '2026-07-01 12:00',
  },
  {
    id: 'tx-006',
    type: 'profit',
    amount: 20.0,
    currency: 'USDT',
    status: 'completed',
    date: '2026-07-01 14:30',
  },
  {
    id: 'tx-007',
    type: 'deposit',
    amount: 1.5,
    currency: 'ETH',
    status: 'completed',
    date: '2026-06-30 16:20',
  },
  {
    id: 'tx-008',
    type: 'bonus',
    amount: 50.0,
    currency: 'USDT',
    status: 'completed',
    date: '2026-06-30 10:00',
  },
]

export interface Task {
  id: string
  type: 'daily' | 'weekly' | 'special'
  titleKey: string
  title: { ar: string; en: string }
  desc: { ar: string; en: string }
  reward: number
  rewardType: 'usdt' | 'points'
  completed: boolean
  claimed: boolean
  progress?: number
  total?: number
  icon: string
}

export const mockTasks: Task[] = [
  {
    id: 't1',
    type: 'daily',
    titleKey: 'checkIn',
    title: { ar: 'تسجيل الدخول اليومي', en: 'Daily Check-in' },
    desc: { ar: 'سجل دخولك ليومك واحصل على المكافأة', en: 'Log in today and claim your reward' },
    reward: 1,
    rewardType: 'usdt',
    completed: true,
    claimed: false,
    icon: '📅',
  },
  {
    id: 't2',
    type: 'daily',
    titleKey: 'watchVideo',
    title: { ar: 'شاهد فيديو تعليمي', en: 'Watch Tutorial Video' },
    desc: { ar: 'شاهد فيديو مدته دقيقتان عن استراتيجيات التعدين', en: 'Watch a 2-min video on mining strategies' },
    reward: 2.5,
    rewardType: 'usdt',
    completed: false,
    claimed: false,
    progress: 45,
    total: 100,
    icon: '🎬',
  },
  {
    id: 't3',
    type: 'daily',
    titleKey: 'followSocial',
    title: { ar: 'تابعنا على X', en: 'Follow us on X' },
    desc: { ar: 'تابع حسابنا الرسمي على منصة X', en: 'Follow our official account on X' },
    reward: 50,
    rewardType: 'points',
    completed: false,
    claimed: false,
    icon: '𝕏',
  },
  {
    id: 't4',
    type: 'daily',
    titleKey: 'inviteFriends',
    title: { ar: 'ادعُ صديقاً واحداً', en: 'Invite 1 friend' },
    desc: { ar: 'شارك رابطك وادعُ صديقاً واحداً للتسجيل', en: 'Share your link and invite 1 friend to sign up' },
    reward: 5,
    rewardType: 'usdt',
    completed: false,
    claimed: false,
    progress: 0,
    total: 1,
    icon: '👥',
  },
  {
    id: 't5',
    type: 'daily',
    titleKey: 'shareLink',
    title: { ar: 'شارك الرابط على وسائل التواصل', en: 'Share link on social media' },
    desc: { ar: 'انشر رابط الإحالة على أي منصة تواصل اجتماعي', en: 'Post your referral link on any social platform' },
    reward: 1.5,
    rewardType: 'usdt',
    completed: false,
    claimed: false,
    icon: '🔗',
  },
  {
    id: 't6',
    type: 'weekly',
    titleKey: 'invite5',
    title: { ar: 'ادعُ 5 أصدقاء', en: 'Invite 5 friends' },
    desc: { ar: 'ادعُ 5 أصدقاء جدد هذا الأسبوع', en: 'Invite 5 new friends this week' },
    reward: 50,
    rewardType: 'usdt',
    completed: false,
    claimed: false,
    progress: 2,
    total: 5,
    icon: '🎯',
  },
  {
    id: 't7',
    type: 'weekly',
    titleKey: 'invest1000',
    title: { ar: 'استثمر 1000$ هذا الأسبوع', en: 'Invest $1000 this week' },
    desc: { ar: 'حقق حجم استثمار أسبوعي بقيمة 1000$', en: 'Reach $1000 weekly investment volume' },
    reward: 500,
    rewardType: 'points',
    completed: false,
    claimed: false,
    progress: 350,
    total: 1000,
    icon: '💰',
  },
  {
    id: 't8',
    type: 'special',
    titleKey: 'vipUpgrade',
    title: { ar: 'الترقية إلى VIP الذهبي', en: 'Upgrade to Gold VIP' },
    desc: { ar: 'استثمر في الخطة الذهبية لأول مرة', en: 'Invest in the Gold plan for the first time' },
    reward: 25,
    rewardType: 'usdt',
    completed: true,
    claimed: true,
    icon: '👑',
  },
]

export interface AdminUser {
  id: string
  name: string
  email: string
  balance: number
  totalInvested: number
  status: 'active' | 'blocked' | 'pending'
  plan: string
  joinedAt: string
  lastActive: string
  country: string
}

export const mockAdminUsers: AdminUser[] = [
  { id: 'u001', name: 'Ahmed Hassan', email: 'ahmed@example.com', balance: 4520.50, totalInvested: 5000, status: 'active', plan: 'Gold', joinedAt: '2026-05-12', lastActive: '2 min ago', country: '🇦🇪 UAE' },
  { id: 'u002', name: 'Sara Al-Rashid', email: 'sara@example.com', balance: 12350.75, totalInvested: 10000, status: 'active', plan: 'Diamond', joinedAt: '2026-04-28', lastActive: '15 min ago', country: '🇸🇦 KSA' },
  { id: 'u003', name: 'John Smith', email: 'john@example.com', balance: 850.00, totalInvested: 200, status: 'active', plan: 'Silver', joinedAt: '2026-06-15', lastActive: '1 hour ago', country: '🇺🇸 USA' },
  { id: 'u004', name: 'Mei Lin', email: 'mei@example.com', balance: 0, totalInvested: 0, status: 'pending', plan: '-', joinedAt: '2026-07-01', lastActive: '5 hours ago', country: '🇸🇬 Singapore' },
  { id: 'u005', name: 'Carlos Rivera', email: 'carlos@example.com', balance: 2890.30, totalInvested: 500, status: 'blocked', plan: 'Basic', joinedAt: '2026-03-20', lastActive: '3 days ago', country: '🇪🇸 Spain' },
  { id: 'u006', name: 'Fatima Noor', email: 'fatima@example.com', balance: 7820.00, totalInvested: 1000, status: 'active', plan: 'Diamond', joinedAt: '2026-05-30', lastActive: '30 min ago', country: '🇧🇭 Bahrain' },
  { id: 'u007', name: 'David Kim', email: 'david@example.com', balance: 1560.40, totalInvested: 500, status: 'active', plan: 'Gold', joinedAt: '2026-06-22', lastActive: '1 day ago', country: '🇰🇷 Korea' },
  { id: 'u008', name: 'Layla Ahmed', email: 'layla@example.com', balance: 320.00, totalInvested: 50, status: 'active', plan: 'Basic', joinedAt: '2026-06-29', lastActive: '6 hours ago', country: '🇪🇬 Egypt' },
]

// Live market data for ticker
export const marketData = [
  { symbol: 'BTC', price: 67850.32, change: 2.45 },
  { symbol: 'ETH', price: 3520.18, change: 1.82 },
  { symbol: 'BNB', price: 598.45, change: -0.65 },
  { symbol: 'SOL', price: 178.32, change: 4.12 },
  { symbol: 'XRP', price: 0.5821, change: -1.23 },
  { symbol: 'ADA', price: 0.4523, change: 0.85 },
  { symbol: 'AVAX', price: 32.18, change: 3.45 },
  { symbol: 'DOGE', price: 0.1523, change: 5.62 },
  { symbol: 'DOT', price: 6.85, change: -0.42 },
  { symbol: 'MATIC', price: 0.7821, change: 1.95 },
]

// Testimonials
export const testimonials = [
  {
    name: 'Omar Al-Farsi',
    role: { ar: 'مستثمر عقاري', en: 'Real Estate Investor' },
    country: '🇦🇪',
    avatar: 'OF',
    rating: 5,
    text: {
      ar: 'منصة احترافية بكل المقاييس. الأرباح تصل يومياً بانتظام والسحب فوري فعلاً. أفضل استثمار لي في 2026.',
      en: 'A truly professional platform. Daily profits arrive on time and withdrawals are genuinely instant. My best investment in 2026.',
    },
  },
  {
    name: 'Jennifer Park',
    role: { ar: 'رائدة أعمال', en: 'Entrepreneur' },
    country: '🇰🇷',
    avatar: 'JP',
    rating: 5,
    text: {
      ar: 'بعد تجربة عدة منصات، هذه هي الوحيدة التي تلتزم بشفافية كاملة. لوحة التحكم رائعة والدعم متجاوب.',
      en: 'After trying multiple platforms, this is the only one that delivers full transparency. The dashboard is amazing and support is responsive.',
    },
  },
  {
    name: 'Hassan Mubarak',
    role: { ar: 'محلل مالي', en: 'Financial Analyst' },
    country: '🇸🇦',
    avatar: 'HM',
    rating: 5,
    text: {
      ar: 'الأمان مؤسسي والمعدلات أرباح تنافسية. أنصح بها بشدة لأي مستثمر جاد يبحث عن دخل سلبي حقيقي.',
      en: 'Institutional-grade security with competitive returns. Highly recommend for any serious investor seeking real passive income.',
    },
  },
  {
    name: 'Maria Garcia',
    role: { ar: 'مصممة جرافيك', en: 'Graphic Designer' },
    country: '🇪🇸',
    avatar: 'MG',
    rating: 5,
    text: {
      ar: 'بدأت بالخطة الفضية والآن أنا في الماسية. النظام يفي بكل وعوده، والإحالات تدر دخلاً إضافياً ممتازاً.',
      en: 'Started with Silver, now I am on Diamond. The system delivers on every promise, and referrals generate excellent extra income.',
    },
  },
  {
    name: 'Yusuf Demir',
    role: { ar: 'مهندس برمجيات', en: 'Software Engineer' },
    country: '🇹🇷',
    avatar: 'YD',
    rating: 5,
    text: {
      ar: 'كمطور، أقدر الجودة التقنية للمنصة. الواجهة سلسة والأمان على أعلى مستوى. أرباحي تضاعفت خلال شهرين.',
      en: 'As a developer, I appreciate the technical quality. Smooth UI and top-tier security. My profits doubled in two months.',
    },
  },
  {
    name: 'Aisha Mohamed',
    role: { ar: 'طبيبة أسنان', en: 'Dentist' },
    country: '🇧🇭',
    avatar: 'AM',
    rating: 5,
    text: {
      ar: 'أفضل قرار استثماري اتخذته هذا العام. التطبيق سهل الاستخدام والإشعارات تبقيني على اطلاع دائم.',
      en: 'The best investment decision I made this year. The app is user-friendly and notifications keep me always informed.',
    },
  },
]

// FAQ items
export const faqItems = [
  {
    q: { ar: 'كيف أبدأ الاستثمار؟', en: 'How do I start investing?' },
    a: {
      ar: 'أنشئ حساباً مجاناً، أودع الحد الأدنى المطلوب للخطة المختارة، وسيبدأ التعدين فوراً. الأرباح تُحتسب يومياً وتُضاف تلقائياً لرصيدك.',
      en: 'Create a free account, deposit the minimum required for your chosen plan, and mining starts instantly. Profits are calculated daily and added to your balance automatically.',
    },
  },
  {
    q: { ar: 'ما هو الحد الأدنى للإيداع؟', en: 'What is the minimum deposit?' },
    a: {
      ar: 'يختلف الحد الأدنى حسب العملة. للخطة الأساسية 50$، يمكنك الإيداع بـ BTC (0.0005) أو USDT (10$) أو أي عملة مدعومة.',
      en: 'Minimums vary by currency. For the Basic plan at $50, you can deposit via BTC (0.0005), USDT ($10), or any supported coin.',
    },
  },
  {
    q: { ar: 'كم تستغرق السحوبات؟', en: 'How long do withdrawals take?' },
    a: {
      ar: 'السحوبات تتم خلال 5-30 دقيقة للعملات الرقمية. يتم التأكيد التلقائي بعد التحقق الأمني. السحوبات الكبيرة قد تستغرق حتى ساعة.',
      en: 'Withdrawals are processed within 5-30 minutes for crypto. Auto-confirmed after security checks. Larger withdrawals may take up to 1 hour.',
    },
  },
  {
    q: { ar: 'هل المنصة آمنة؟', en: 'Is the platform secure?' },
    a: {
      ar: 'نعم. نستخدم تشفير AES-256، مصادقة ثنائية، تخزين بارد لـ 95% من الأصول، حماية DDoS، ومراجعات أمنية دورية من شركات مستقلة.',
      en: 'Yes. We use AES-256 encryption, 2FA, cold storage for 95% of assets, DDoS protection, and regular independent security audits.',
    },
  },
  {
    q: { ar: 'كيف يعمل نظام الإحالات؟', en: 'How does the referral system work?' },
    a: {
      ar: 'شارك رابطك الفريد. تحصل على 10% من استثمارات المستوى الأول، 5% للثاني، 2% للثالث. العمولات مدى الحياة وتُدفع تلقائياً.',
      en: 'Share your unique link. Earn 10% on Level 1 investments, 5% on Level 2, 2% on Level 3. Lifetime commissions, paid automatically.',
    },
  },
  {
    q: { ar: 'هل يمكنني إعادة استثمار أرباحي؟', en: 'Can I reinvest my profits?' },
    a: {
      ar: 'نعم، يمكنك تفعيل خاصية إعادة الاستثمار التلقائي لأي خطة، أو إعادة الاستثمار يدوياً في أي وقت لزيادة أرباحك المركبة.',
      en: 'Yes, you can enable auto-reinvest for any plan, or manually reinvest at any time to grow your compound returns.',
    },
  },
  {
    q: { ar: 'ما العملات المدعومة؟', en: 'Which cryptocurrencies are supported?' },
    a: {
      ar: 'ندعم Bitcoin، Ethereum، USDT (TRC20/ERC20)، BNB، Litecoin للإيداع والسحب. جميع الأرباح تُحسب بالدولار الأمريكي.',
      en: 'We support Bitcoin, Ethereum, USDT (TRC20/ERC20), BNB, and Litecoin for deposits and withdrawals. All profits are calculated in USD.',
    },
  },
  {
    q: { ar: 'هل هناك رسوم خفية؟', en: 'Are there hidden fees?' },
    a: {
      ar: 'لا توجد رسوم خفية. رسوم السحب فقط تُطبق حسب الشبكة وهي معروضة بشفافية. لا توجد رسوم إيداع أو إدارة.',
      en: 'No hidden fees. Only network-based withdrawal fees apply, displayed transparently. No deposit or management fees.',
    },
  },
]

// News items
export const newsItems = [
  {
    title: { ar: 'BTC يتجاوز 68 ألف دولار وسط تدفقات ETF قياسية', en: 'BTC crosses $68k amid record ETF inflows' },
    summary: {
      ar: 'سجل البيتكوين أعلى مستوى له في 3 أشهر مع تدفقات يومية قياسية إلى صناديق ETF الفورية.',
      en: 'Bitcoin hit a 3-month high with record daily inflows into spot ETFs.',
    },
    category: { ar: 'بيتكوين', en: 'Bitcoin' },
    time: '2h',
    image: '📈',
  },
  {
    title: { ar: 'إيثريوم يقترب من ترقية Dencun', en: 'Ethereum nears Dencun upgrade' },
    summary: {
      ar: 'تحسينات كبيرة على قابلية التوسع وخفض الرسوم متوقعة مع الترقية القادمة.',
      en: 'Major scalability and fee reduction improvements expected with the upcoming upgrade.',
    },
    category: { ar: 'إيثريوم', en: 'Ethereum' },
    time: '5h',
    image: '⚡',
  },
  {
    title: { ar: 'ارتفاع حجم تداول BNB بنسبة 35%', en: 'BNB trading volume up 35%' },
    summary: {
      ar: 'سلسلة BNB الذكية تشهد نمواً قوياً مع زيادة الاهتمام بتطبيقات DeFi.',
      en: 'BNB Smart Chain sees strong growth with rising DeFi application interest.',
    },
    category: { ar: 'BNB', en: 'BNB' },
    time: '8h',
    image: '🚀',
  },
  {
    title: { ar: 'العملات الرقمية تتجاوز 2.5 تريليون دولار', en: 'Crypto market cap exceeds $2.5T' },
    summary: {
      ar: 'القيمة السوقية الإجمالية للعملات الرقمية تصل لمستوى قياسي جديد وسط تعافي السوق.',
      en: 'Total crypto market cap reaches new all-time high amid market recovery.',
    },
    category: { ar: 'السوق', en: 'Market' },
    time: '12h',
    image: '💰',
  },
]

// Profit chart data (last 30 days)
export const profitChartData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  profit: Math.round((20 + Math.sin(i / 3) * 5 + i * 0.8) * 100) / 100,
  total: Math.round((20 * (i + 1) + Math.sin(i / 3) * 30 + i * 0.5) * 100) / 100,
}))

// Mining hashrate chart data
export const miningChartData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  hashrate: Math.round((145 + Math.sin(i / 4) * 8 + Math.random() * 3) * 100) / 100,
  blocks: Math.floor(Math.random() * 5) + 2,
}))

// Admin dashboard chart data
export const adminRevenueData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  deposits: Math.round(50000 + i * 12000 + Math.random() * 8000),
  withdrawals: Math.round(30000 + i * 7000 + Math.random() * 5000),
  profit: Math.round(20000 + i * 5000 + Math.random() * 3000),
}))

export const userGrowthData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  users: Math.round(5000 + i * 1800 + Math.random() * 1000),
  active: Math.round(3500 + i * 1400 + Math.random() * 800),
}))
