# 🚀 دليل النشر السريع - خطوة بخطوة

## ✅ المتطلبات
- حساب GitHub (مجاني): github.com
- حساب Vercel (مجاني): vercel.com
- (اختياري) حساب Google Cloud لـ OAuth

---

## 📦 الخطوة 1: تحضير الملفات

قبل الرفع، احذف هذه المجلدات/الملفات (خاصة بالبيئة المحلية):

```bash
# في مجلد المشروع
rm -rf .zscripts/ examples/ mini-services/ Caddyfile dev.log
rm -rf db/*.db db/*.db-journal
rm -rf .next/
```

---

## 📤 الخطوة 2: رفع المشروع على GitHub

### 2.1 - أنشئ Repository جديد على GitHub
1. اذهب إلى https://github.com/new
2. اسم المشروع: `crypto-mining-platform`
3. اختر **Private** أو **Public**
4. اضغط **Create repository**

### 2.2 - ارفع الكود

```bash
# في مجلد المشروع المحلي
cd /path/to/your/project

# تهيئة Git (إذا لم يكن مهيأ)
git init
git add .
git commit -m "🚀 Crypto Mining Platform 2026 - Initial Release"

# اربط بـ GitHub (استبدل USERNAME باسمك)
git remote add origin https://github.com/USERNAME/crypto-mining-platform.git
git branch -M main
git push -u origin main
```

**إذا طلب بيانات الدخول:**
- استخدم GitHub CLI: `gh auth login`
- أو Personal Access Token من: GitHub → Settings → Developer settings → Personal access tokens

---

## ☁️ الخطوة 3: النشر على Vercel

### 3.1 - اربط Vercel بـ GitHub
1. اذهب إلى https://vercel.com/new
2. سجل الدخول بحساب GitHub
3. اضغط **"Add New"** → **"Project"**

### 3.2 - اختر الـ Repository
1. ابحث عن `crypto-mining-platform`
2. اضغط **"Import"**

### 3.3 - إعدادات البناء
Vercel سيكتشف Next.js تلقائياً. تأكد فقط:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 3.4 - أضف متغيرات البيئة
في صفحة الإعدادات، اضغط **"Environment Variables"** وأضف:

| Key | Value |
|-----|-------|
| NEXTAUTH_URL | https://your-project.vercel.app |
| NEXTAUTH_SECRET | (شغل: `openssl rand -base64 32`) |
| DATABASE_URL | (من Vercel Postgres أو MongoDB Atlas) |

### 3.5 - اضغط "Deploy"

انتظر 2-5 دقائق. ستحصل على رابط مثل:
```
https://crypto-mining-platform-abc123.vercel.app
```

---

## 🗄️ الخطوة 4: إضافة قاعدة بيانات (مجانية)

### الخيار A: Vercel Postgres (الأسهل)
1. في لوحة Vercel → مشروعك → **Storage** tab
2. اضغط **"Create"** → **"Postgres"**
3. اضغط **"Connect"** لربطها بالمشروع
4. ستحصل على `DATABASE_URL` تلقائياً

### الخيار B: MongoDB Atlas (للمشروع الحالي)
1. اذهب إلى https://mongodb.com/atlas → سجل مجاناً
2. أنشئ Cluster (M0 مجاني)
3. Database Access → أنشئ مستخدم
4. Network Access → أضف `0.0.0.0/0`
5. Connect → "Connect your application" → انسخ الـ URL
6. أضفه في Vercel كـ `DATABASE_URL`

---

## 🔐 الخطوة 5: إعداد Google OAuth (اختياري)

1. اذهب إلى https://console.cloud.google.com
2. أنشئ مشروع جديد
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
4. نوع: **Web application**
5. **Authorized redirect URIs** أضف:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
6. انسخ **Client ID** و **Client Secret**
7. أضفهما في Vercel:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

---

## 🌐 الخطوة 6: ربط نطاق مخصص (اختياري)

### شراء نطاق
- Namecheap, GoDaddy, Google Domains (~$10/سنة)

### على Vercel
1. مشروعك → **Settings** → **Domains**
2. اضغط **"Add"** → اكتب نطاقك (مثلاً `cryptomine.io`)
3. أضف DNS records في موقع النطاق:

```
Type: A
Name/Host: @
Value: 76.76.21.21

Type: CNAME
Name/Host: www
Value: cname.vercel-dns.com
```

4. انتظر 24-48 ساعة للتفعيل
5. SSL يُفعّل تلقائياً (مجاني)

---

## ✅ التحقق من النشر

بعد النشر، تأكد أن:
- [ ] الصفحة الرئيسية تفتح
- [ ] زر "Sign Up" يعمل
- [ ] التبديل بين العربية والإنجليزية يعمل
- [ ] Dark/Light mode يعمل
- [ ] الموقع متجاوب على الموبايل

---

## 🆘 المشاكل الشائعة

### فشل البناء (Build Failed)
```bash
# محلياً، تأكد أن البناء يعمل:
npm run build
# أصلح أي أخطاء، ثم git commit & push
```

### خطأ في Prisma
أضف في `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### الموقع أبيض (White Screen)
- تحقق من console المتصفح (F12)
- غالباً مشكلة في Environment Variables
- أعد النشر بعد إضافتها

### بطء التحميل
- فعّل Edge Functions في Vercel
- استخدم Vercel CDN (تلقائي)

---

## 📊 الباقات المجانية

| المنصة | الحد المجاني | المميزات |
|--------|-------------|----------|
| Vercel Hobby | 100GB bandwidth/شهر | نشر غير محدود، SSL مجاني |
| MongoDB Atlas | 512MB | قاعدة بيانات كاملة |
| Vercel Postgres | 256MB | PostgreSQL حقيقي |
| Cloudflare | غير محدود | CDN + DNS مجاني |

---

## 🎉 مبروك!

موقعك الآن مباشر على الإنترنت!
شارك الرابط مع أصدقائك وابدأ الاستثمار.

```
https://your-project.vercel.app
```

للمساعدة: support@cryptomine.io
