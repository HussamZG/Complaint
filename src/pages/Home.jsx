import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Features from '../components/Features'
import Hero from '../components/Hero'

const features = [
  {
    title: 'سهولة الاستخدام',
    description: 'واجهة بسيطة وسهلة الاستخدام تمكنك من تقديم شكواك في دقائق معدودة',
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-emerald-500 to-teal-600'
  },
  {
    title: 'خصوصية وأمان',
    description: 'نضمن خصوصية وسرية جميع البيانات المقدمة في النظام',
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: 'متابعة فورية',
    description: 'تتبع حالة شكواك بشكل مباشر ومعرفة آخر التحديثات',
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'from-purple-500 to-pink-600'
  },
]

function Home() {
  const navigate = useNavigate()
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, isAdmin, navigate])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 dark:from-dark-800 dark:via-dark-700 dark:to-dark-900 pb-48 pt-32">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white dark:from-dark-800 to-transparent"></div>
          <div className="absolute -left-10 top-1/2 w-40 h-40 bg-primary-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -right-10 top-1/3 w-40 h-40 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl font-arabic">
                <span className="block">نظام الشكاوى الإلكتروني</span>
                <span className="block text-primary-200 mt-3 text-3xl sm:text-4xl">حلول سريعة لمشاكلك</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-primary-100 sm:text-xl md:mt-8">
                منصة متكاملة تتيح لك تقديم ومتابعة شكواك بكل سهولة وأمان. نحن هنا لمساعدتك في حل مشاكلك بأسرع وقت ممكن.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <Link
                  to="/submit-complaint"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  تقديم شكوى جديدة
                  <svg className="mr-3 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
                <Link
                  to="/track-complaint"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-primary-700 bg-white hover:bg-primary-50 transform hover:scale-105 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  تتبع شكوى
                  <svg className="mr-3 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative mt-24 lg:mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-dark-900 dark:text-dark-100">
              مميزات النظام
            </h2>
            <p className="mt-4 text-xl text-dark-600 dark:text-dark-300">
              كل ما تحتاجه لتقديم ومتابعة شكواك في مكان واحد
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8 transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative flex flex-col h-full">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-200`}>
                    {feature.icon}
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-dark-900 dark:text-dark-100">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-dark-600 dark:text-dark-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative mt-32 bg-gradient-to-br from-primary-600 to-primary-700 dark:from-dark-700 dark:to-dark-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-primary-500 rounded-2xl blur-2xl opacity-25"></div>
            <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-8 py-12 text-center">
                <h2 className="text-3xl font-extrabold text-dark-900 dark:text-dark-100 sm:text-4xl">
                  هل لديك شكوى؟
                </h2>
                <p className="mt-4 text-lg text-dark-600 dark:text-dark-300">
                  نحن هنا لمساعدتك. قم بتقديم شكواك الآن وسنقوم بمتابعتها معك خطوة بخطوة.
                </p>
                <div className="mt-8">
                  <Link
                    to="/submit-complaint"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary-500/50"
                  >
                    ابدأ الآن
                    <svg className="mr-3 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home