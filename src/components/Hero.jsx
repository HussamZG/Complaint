import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white dark:bg-dark-800 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute left-0 inset-y-0 h-full w-48 text-white dark:text-dark-800 transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="sm:text-center lg:text-right">
              <h1 className="text-4xl tracking-tight font-extrabold text-dark-900 dark:text-dark-100 sm:text-5xl md:text-6xl">
                <span className="block">نظام إدارة الشكاوى</span>
                <span className="block text-primary-600 dark:text-primary-500">سهل وسريع</span>
              </h1>
              <p className="mt-3 text-base text-dark-500 dark:text-dark-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                نظام متكامل لإدارة الشكاوى يتيح لك تقديم ومتابعة شكواك بكل سهولة ويسر. يمكنك الآن تقديم شكواك في أي وقت ومن أي مكان.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-end">
                <div className="rounded-md shadow">
                  <Link
                    to="/submit-complaint"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                  >
                    تقديم شكوى
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:mr-3">
                  <Link
                    to="/track-complaint"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                  >
                    تتبع شكوى
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="/hero-image.jpg"
          alt="نظام إدارة الشكاوى"
        />
      </div>
    </div>
  )
}

export default Hero
