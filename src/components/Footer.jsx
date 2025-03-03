import React from 'react'
import { Link } from 'react-router-dom'

const footerLinks = [
  {
    title: 'روابط سريعة',
    links: [
      { name: 'الرئيسية', href: '/' },
      { name: 'تقديم شكوى', href: '/submit-complaint' },
      { name: 'تتبع شكوى', href: '/track-complaint' },
      { name: 'الأسئلة الشائعة', href: '/faq' },
    ],
  },
  {
    title: 'الدعم',
    links: [
      { name: 'تواصل معنا', href: '/contact' },
      { name: 'سياسة الخصوصية', href: '/privacy' },
      { name: 'الشروط والأحكام', href: '/terms' },
    ],
  },
]

const socialLinks = [
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
  },
]

function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 sm:col-span-2">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                />
              </svg>
              <span className="text-lg sm:text-xl font-bold text-dark-900 dark:text-white">شكاوي</span>
            </Link>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 max-w-md">
              منصة متكاملة لإدارة ومتابعة الشكاوى والمقترحات بكل سهولة وفعالية
            </p>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-100 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                {section.links.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm sm:text-base text-dark-600 hover:text-primary-600 dark:text-dark-300 dark:hover:text-primary-500 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-dark-700">
          <p className="text-center text-sm sm:text-base text-dark-500 dark:text-dark-400">
            &copy; {new Date().getFullYear()} SHTAYER. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer