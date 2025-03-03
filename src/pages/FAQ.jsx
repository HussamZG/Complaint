import React, { useState } from 'react'

const faqs = [
  {
    question: 'كيف يمكنني تقديم شكوى؟',
    answer: 'يمكنك تقديم شكوى من خلال النقر على زر "تقديم شكوى" في الصفحة الرئيسية وملء النموذج المطلوب.'
  },
  {
    question: 'كيف يمكنني متابعة شكواي؟',
    answer: 'يمكنك متابعة شكواك من خلال صفحة "تتبع شكوى" باستخدام رقم التتبع الذي تم إرساله إليك.'
  },
  {
    question: 'ما هي المدة المتوقعة للرد على الشكوى؟',
    answer: 'نسعى للرد على جميع الشكاوى خلال 48 ساعة عمل من وقت تقديمها.'
  },
  {
    question: 'هل يمكنني تعديل الشكوى بعد تقديمها؟',
    answer: 'لا يمكن تعديل الشكوى بعد تقديمها، ولكن يمكنك إضافة معلومات جديدة من خلال الرد على البريد الإلكتروني الذي سيصلك.'
  },
  {
    question: 'كيف يتم حماية بياناتي الشخصية؟',
    answer: 'نحن نتعامل مع بياناتك الشخصية بسرية تامة ونستخدم تقنيات تشفير متقدمة لحماية معلوماتك. لا نشارك بياناتك مع أي طرف ثالث دون موافقتك.'
  },
  {
    question: 'من يمكنه الاطلاع على تفاصيل شكواي؟',
    answer: 'فقط الموظفون المختصون المصرح لهم بالتعامل مع الشكاوى يمكنهم الاطلاع على تفاصيل شكواك. يتم تسجيل جميع عمليات الوصول للحفاظ على الخصوصية.'
  },
  {
    question: 'ما هي مدة احتفاظكم ببيانات الشكوى؟',
    answer: 'نحتفظ ببيانات الشكاوى لمدة عامين من تاريخ إغلاقها، بعد ذلك يتم حذفها تلقائياً من أنظمتنا وفقاً لسياسة حفظ البيانات.'
  }
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 dark:from-dark-900 dark:to-dark-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-4">
            الأسئلة الشائعة
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            إجابات على الأسئلة الأكثر شيوعاً
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-dark-800 rounded-lg shadow-soft overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-[1.02] ${
                openIndex === index ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => toggleFaq(index)}
            >
              <div className="p-6 cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-primary-500 transform transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div
                  className={`mt-2 text-dark-600 dark:text-dark-400 transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQ