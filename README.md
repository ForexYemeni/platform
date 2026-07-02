# 🚀 Crypto Mining Investment Platform 2026

منصة استثمار وتعدين عملات رقمية احترافية بتصميم عالمي فاخر لعام 2026.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 المحتويات

- [المميزات](#-المميزات)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [التشغيل المحلي](#-التشغيل-المحلي)
- [النشر على Vercel](#-النشر-على-vercel-موصى-به)
- [النشر على منصات أخرى](#-النشر-على-منصات-أخرى)
- [ربط نطاق مخصص](#-ربط-نطاق-مخصص)
- [استكشاف الأخطاء](#-استكشاف-الأخطاء)

---

## ✨ المميزات

### 🎨 التصميم
- Dark/Light mode مع تبديل فوري
- دعم كامل للعربية (RTL) والإنجليزية (LTR)
- تأثيرات حركية سلسة عبر Framer Motion
- تصميم فاخر: أزرق كهربائي، بنفسجي، ذهبي
- متجاوب 100% (موبايل، تابلت، ديسكتوب)

### 👤 قسم المستخدم
- مصادقة كاملة (بريد، Google، Telegram، Apple)
- مصادقة ثنائية (2FA) + OTP
- لوحة تحكم تفاعلية مع رسوم بيانية مباشرة
- 4 خطط تعدين (Basic, Silver, Gold, Diamond)
- إيداع/سحب بـ 6 عملات (BTC, ETH, USDT, BNB, LTC)
- نظام إحالات 3 مستويات (10% + 5% + 2%)
- نظام مهام يومية ومكافآت
- إشعارات متعددة القنوات

### 🛡️ لوحة الإدارة
- إحصائيات لحظية ورسوم بيانية
- إدارة المستخدمين (حظر، تعديل، رسائل)
- مراجعة الإيداعات والسحوبات
- إدارة الخطط والمهام
- إعدادات النظام (API keys، أمان)

---

## 🛠 التقنيات المستخدمة

| الفئة | التقنية |
|------|---------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animation | Framer Motion |
| Charts | Recharts |
| State | Zustand |
| Auth | NextAuth.js |
| Database | Prisma ORM (SQLite/MongoDB/PostgreSQL) |
| Icons | Lucide React |
| Fonts | Cairo, Tajawal, Geist |

---

## 💻 التشغيل المحلي

### المتطلبات
- Node.js 18+ أو Bun
- Git

### الخطوات

```bash
# 1. استنساخ المشروع
git clone https://github.com/USERNAME/crypto-mining-platform.git
cd crypto-mining-platform

# 2. تثبيت الحزم
bun install
# أو
npm install

# 3. نسخ ملف البيئة
cp .env.example .env
# عدّل القيم حسب احتياجك

# 4. تهيئة قاعدة البيانات (اختياري)
bun run db:push

# 5. تشغيل خادم التطوير
bun run dev
# أو
npm run dev
```

الموقع سيعمل على `http://localhost:3000`

---

## ☁️ النشر على Vercel (موصى به)

Vercel هو الخيار الأمثل لأنها شركة مُطوّرة Next.js — النشر سهل وسريع.

### الخطوة 1: رفع المشروع على GitHub

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit: Crypto Mining Platform 2026"

# أنشئ repository على github.com أولاً
git remote add origin https://github.com/USERNAME/crypto-mining-platform.git
git branch -M main
git push -u origin main
```

### الخطوة 2: النشر على Vercel

1. اذهب إلى **[vercel.com](https://vercel.com)** وسجل بحساب GitHub
2. اضغط **"Add New"** → **"Project"**
3. اختر الـ repository الذي رفعته
4. إعدادات البناء (تُكتشف تلقائياً، لكن تأكد):
   - **Framework Preset**: Next.js
   - **Build Command**: `bun run build` أو `npm run build`
   - **Output Directory**: `.next`
5. أضف متغيرات البيئة (انظر `.env.example`)
6. اضغط **"Deploy"**

### الخطوة 3: إضافة قاعدة بيانات (اختياري)

**Vercel Postgres (مجاني):**
1. في لوحة Vercel → **Storage** → **Create** → **Postgres**
2. انسخ `DATABASE_URL` إلى Environment Variables
3. عدّل `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. شغّل `bun run db:push` محلياً

**بدائل مجانية أخرى:**
- [MongoDB Atlas](https://mongodb.com/atlas) - 512MB مجاني
- [Supabase](https://supabase.com) - 500MB PostgreSQL مجاني
- [PlanetScale](https://planetscale.com) - MySQL مجاني

### الخطوة 4: إضافة OAuth (اختياري)

**Google OAuth:**
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com)
2. أنشئ مشروع → **APIs & Services** → **Credentials**
3. أنشئ **OAuth 2.0 Client ID**
4. أضف رابط Vercel في **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
5. انسخ `Client ID` و `Client Secret` إلى Vercel env vars

**Telegram Bot:**
1. تابع `@BotFather` على Telegram
2. أرسل `/newbot` وأنشئ بوت
3. احصل على `BOT_TOKEN`
4. أضفه إلى Vercel env vars

---

## 🌐 النشر على منصات أخرى

### Netlify

```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# النشر
netlify deploy --build
# للنشر النهائي:
netlify deploy --prod --build
```

**إعدادات:**
- Build Command: `npm run build`
- Publish Directory: `.next`
- أضف plugin: `@netlify/plugin-nextjs`

### Railway

```bash
# تثبيت Railway CLI
npm install -g @railway/cli

railway login
railway init
railway up
```

### Docker (لأي خادم VPS)

أنشئ ملف `Dockerfile`:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

ثم:
```bash
docker build -t crypto-mining .
docker run -p 3000:3000 crypto-mining
```

### Cloudflare Pages

```bash
npm install -g wrangler
wrangler pages deploy .next --project-name=crypto-mining
```

---

## 🔗 ربط نطاق مخصص (Custom Domain)

### على Vercel

1. اذهب إلى لوحة Vercel → مشروعك → **Settings** → **Domains**
2. أضف نطاقك (مثلاً `cryptomine.io`)
3. في موقع شراء النطاق، أضف DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. انتظر تفعيل SSL (تلقائي، مجاني من Let's Encrypt)

### على Netlify
1. **Domain settings** → **Add custom domain**
2. أضف DNS records مشابهة

---

## 🔧 استكشاف الأخطاء

### المشكلة: فشل البناء على Vercel

**الحل 1:** تأكد أن `package.json` يحتوي على:
```json
"scripts": {
  "build": "next build",
  "start": "next start"
}
```

**الحل 2:** احذف `next.config.ts` مؤقتاً إذا كان به إعدادات خاصة

**الحل 3:** تأكد من إزالة الاستيرادات الخاصة بالبيئة المحلية:
```bash
# تحقق من عدم وجود ملفات تمنع البناء
ls -la
# يجب إزالة: .zscripts/, Caddyfile, examples/, mini-services/
```

### المشكلة: أخطاء Prisma على Vercel

**الحل:** أضف في `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

وأضف `prisma` في `build` في `vercel.json` (موجود بالفعل).

### المشكلة: مشاكل OAuth redirect

تأكد أن رابط إعادة التوجيه مطابق تماماً:
```
https://your-domain.vercel.app/api/auth/callback/google
```

### المشكلة: قاعدة البيانات لا تعمل

- استخدم Vercel Postgres بدلاً من SQLite (SQLite لا يعمل على serverless)
- أو استخدم MongoDB Atlas أو Supabase

### المشكلة: الصور لا تظهر

أضف في `next.config.ts`:
```typescript
images: {
  unoptimized: true,
}
```

---

## 📞 الدعم

- 📧 البريد: support@cryptomine.io
- 💬 Telegram: @CryptoMineBot
- 🌐 الموقع: [cryptomine.io](https://cryptomine.io)

---

## 📄 الترخيص

MIT License - يمكنك استخدامه وتعديله بحرية.

---

## ⚠️ إخلاء المسؤولية

هذا المشروع لأغراض تعليمية. الاستثمار في العملات الرقمية ينطوي على مخاطر. تأكد من الامتثال لقوانين بلدك قبل الإطلاق التجاري.
