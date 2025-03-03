import React from 'react'

const features = [
  {
    title: 'تقديم شكوى',
    description: 'قم بتقديم شكواك بسهولة وسرعة من خلال نموذج بسيط',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    title: 'تتبع الشكوى',
    description: 'تابع حالة شكواك في أي وقت من خلال رقم التتبع',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: 'إشعارات فورية',
    description: 'احصل على تحديثات فورية عن حالة شكواك',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
]

function Features() {
  return (
    <section className="py-12 bg-white dark:bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 dark:text-primary-500 font-semibold tracking-wide uppercase">المميزات</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-dark-900 dark:text-dark-100 sm:text-4xl">
            نظام متكامل لإدارة الشكاوى
          </p>
          <p className="mt-4 max-w-2xl text-xl text-dark-500 dark:text-dark-400 lg:mx-auto">
            نظام سهل الاستخدام يمكنك من تقديم ومتابعة شكواك بكل سهولة
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.title} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 dark:bg-primary-600 text-white">
                    {feature.icon}
                  </div>
                  <p className="mr-16 text-lg leading-6 font-medium text-dark-900 dark:text-dark-100">{feature.title}</p>
                </dt>
                <dd className="mt-2 mr-16 text-base text-dark-500 dark:text-dark-400">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export default Features
