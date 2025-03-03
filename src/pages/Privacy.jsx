import React from 'react';

function Privacy() {
  return (
    <div className="bg-white dark:bg-dark-900 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            سياسة الخصوصية
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            آخر تحديث: 3 مارس 2025
          </p>
        </div>

        <div className="mt-12 prose dark:prose-invert prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">مقدمة</h2>
            <p>
              نحن في شكاوي نلتزم بحماية خصوصية مستخدمينا. تصف سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام منصتنا.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">المعلومات التي نجمعها</h2>
            <p>نقوم بجمع المعلومات التالية:</p>
            <ul className="list-disc mr-6 mt-2 space-y-2">
              <li>المعلومات الشخصية (الاسم، البريد الإلكتروني، رقم الهاتف)</li>
              <li>معلومات الشكوى المقدمة</li>
              <li>معلومات تسجيل الدخول وأنشطة الحساب</li>
              <li>المعلومات التقنية (عنوان IP، نوع المتصفح، نظام التشغيل)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">كيفية استخدام المعلومات</h2>
            <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
            <ul className="list-disc mr-6 mt-2 space-y-2">
              <li>معالجة ومتابعة الشكاوى المقدمة</li>
              <li>التواصل مع المستخدمين بخصوص شكاواهم</li>
              <li>تحسين خدماتنا وتجربة المستخدم</li>
              <li>إرسال تحديثات وإشعارات مهمة</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">حماية المعلومات</h2>
            <p>
              نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. تشمل هذه الإجراءات:
            </p>
            <ul className="list-disc mr-6 mt-2 space-y-2">
              <li>تشفير البيانات الحساسة</li>
              <li>استخدام بروتوكولات أمان متقدمة</li>
              <li>تقييد الوصول إلى المعلومات الشخصية</li>
              <li>مراجعة دورية لإجراءات الأمان</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">حقوق المستخدم</h2>
            <p>يحق لك:</p>
            <ul className="list-disc mr-6 mt-2 space-y-2">
              <li>الوصول إلى معلوماتك الشخصية</li>
              <li>تصحيح معلوماتك الشخصية</li>
              <li>حذف حسابك ومعلوماتك الشخصية</li>
              <li>الاعتراض على معالجة معلوماتك الشخصية</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">التواصل معنا</h2>
            <p>
              إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر:
            </p>
            <ul className="list-disc mr-6 mt-2 space-y-2">
              <li>البريد الإلكتروني: privacy@shakaoy.com</li>
              <li>الهاتف: +966 XX XXX XXXX</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
