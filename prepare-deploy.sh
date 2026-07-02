#!/bin/bash
# ============================================
# Script: تحضير المشروع للنشر على Vercel
# ============================================

set -e

echo "🚀 تحضير المشروع للنشر على Vercel..."
echo "========================================"

# الألوان
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. تنظيف الملفات المحلية
echo -e "${YELLOW}📦 1. تنظيف الملفات المحلية...${NC}"

FILES_TO_REMOVE=(".zscripts" "Caddyfile" "dev.log" "server.log" "examples" "mini-services")
for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -d "$file" ] || [ -f "$file" ]; then
    rm -rf "$file"
    echo "   ✓ تم حذف: $file"
  fi
done

# حذف قاعدة البيانات المحلية
if ls db/*.db 1> /dev/null 2>&1; then
  rm -f db/*.db db/*.db-journal
  echo "   ✓ تم حذف قاعدة البيانات المحلية"
fi

# 2. التحقق من الملفات المطلوبة
echo -e "${YELLOW}✅ 2. التحقق من الملفات المطلوبة...${NC}"

REQUIRED_FILES=("package.json" "next.config.ts" "tsconfig.json" ".env.example" "vercel.json" "README.md")
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "   ${GREEN}✓${NC} $file"
  else
    echo -e "   ${RED}✗ مفقود: $file${NC}"
  fi
done

# 3. اختبار البناء
echo -e "${YELLOW}🔨 3. اختبار البناء...${NC}"
if command -v bun &> /dev/null; then
  bun run lint
  echo -e "   ${GREEN}✓${NC} lint نجح"
else
  npm run lint
  echo -e "   ${GREEN}✓${NC} lint نجح"
fi

# 4. معلومات النشر
echo ""
echo "========================================"
echo -e "${GREEN}🎉 المشروع جاهز للنشر!${NC}"
echo "========================================"
echo ""
echo "📝 الخطوات التالية:"
echo ""
echo "1. ارفع المشروع إلى GitHub:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git remote add origin https://github.com/USERNAME/crypto-mining-platform.git"
echo "   git push -u origin main"
echo ""
echo "2. اذهب إلى https://vercel.com/new"
echo "3. اختر الـ repository"
echo "4. أضف Environment Variables من .env.example"
echo "5. اضغط Deploy!"
echo ""
echo "📚 دليل مفصل: انظر DEPLOYMENT.md"
echo ""
