# IGCC Website

This is the repository for the IGCC (International Governance Consulting Center) website.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## معالجة مشكلة المقالات الجديدة وخطأ 504

### المشكلة
قد تواجه أحيانًا خطأ 504 Gateway Timeout عند محاولة الوصول إلى مقالات جديدة، حتى بعد إعادة بناء الموقع (rebuild).

### الحل
تم تحسين الموقع للتعامل مع هذه المشكلة بالطرق التالية:

1. **آلية الجلب المتعددة**: 
   - المحاولة الأولى: استخدام API الداخلي
   - المحاولة الثانية: جلب البيانات مباشرة من GitHub

2. **معالجة الأخطاء المحسنة**:
   - زيادة وقت الانتظار (timeout)
   - تعزيز المحاولات المتكررة
   - عرض رسائل خطأ أكثر وضوحًا

3. **التخزين المؤقت والتحديث**:
   - تقليل فترة التحقق من صحة البيانات (revalidation) إلى 60 ثانية
   - زر "تحديث" لتحديث البيانات يدويًا

### طريقة إضافة مقال جديد
1. أضف المقال الجديد إلى ملف `news.json` في المستودع
2. انتظر إعادة بناء الموقع (قد يستغرق بضع دقائق)
3. إذا لم يظهر المقال الجديد:
   - اضغط على زر "تحديث" في صفحة الأخبار
   - أو أعد تحميل الصفحة مع إضافة `?refresh=true` إلى عنوان URL

### حل مشكلة 504 للمقالات الجديدة
إذا استمرت مشكلة 504 لمقال جديد:

1. **تأكد من صحة الـ slug**:
   - يجب أن يكون الـ slug متطابقًا تمامًا مع ما في ملف `news.json`
   - حالة الأحرف (كبيرة/صغيرة) مهمة

2. **استخدم الجلب المباشر**:
   - أضف `?direct=true` إلى عنوان URL للمقال لتجاوز API واستخدام الجلب المباشر من GitHub

3. **أعد تشغيل الخادم**:
   - في حالات نادرة، قد تحتاج إلى إعادة تشغيل خادم الموقع

### تفاصيل فنية
- تم إضافة آلية تحقق من حالة إعادة البناء في `/api/rebuild-status`
- تم تحسين آلية التخزين المؤقت لتجنب الطلبات المتكررة لنفس البيانات
- تم زيادة الوقت المسموح به للطلبات الخارجية

## Important Note About Articles

- Each article must have a unique `slug`
- Image URLs should be full paths to images (preferably hosted on GitHub or another CDN)
- The Arabic version of titles and descriptions is required for proper multilingual support 