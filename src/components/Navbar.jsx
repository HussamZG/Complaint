import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('isAdmin')
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-900 shadow-lg backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <svg
                className="w-8 h-8 text-primary-600 dark:text-primary-500"
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
              <span className="mr-3 text-xl font-bold text-primary-600 dark:text-primary-500">نظام الشكاوى</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4 md:space-x-reverse">
            <Link to="/" className="px-3 py-2 text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
              الرئيسية
            </Link>
            
            {isAuthenticated && isAdmin ? (
              <Menu as="div" className="relative mr-3">
                <Menu.Button className="flex items-center px-3 py-2 text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500">
                  <span>لوحة التحكم</span>
                  <svg className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white dark:bg-dark-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/admin/complaints"
                            className={`block px-4 py-2 text-sm ${
                              active ? 'bg-primary-50 dark:bg-dark-700 text-primary-600 dark:text-primary-500' : 'text-dark-700 dark:text-dark-300'
                            }`}
                          >
                            إدارة الشكاوى
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <>
                <Link to="/submit-complaint" className="px-3 py-2 text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                  تقديم شكوى
                </Link>
                <Link to="/track-complaint" className="px-3 py-2 text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                  تتبع شكوى
                </Link>
              </>
            )}

            {isAuthenticated && (
              <Link to="/admin/complaints" className="px-3 py-2 text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                لوحة التحكم
              </Link>
            )}

            <Link to="/faq" className="px-3 py-2 text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
              الأسئلة الشائعة
            </Link>

            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <ThemeToggle />
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="mr-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  تسجيل الخروج
                </button>
              ) : (
                <Link
                  to="/login"
                  className="mr-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500 focus:outline-none"
            >
              <span className="sr-only">فتح القائمة</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition
        show={isMobileMenuOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-dark-900 shadow-lg">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-700 hover:border-primary-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              الرئيسية
            </Link>
            
            {isAuthenticated && isAdmin ? (
              <Link
                to="/admin/complaints"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-700 hover:border-primary-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 ml-2 rtl:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  لوحة التحكم
                </div>
              </Link>
            ) : (
              <>
                <Link
                  to="/submit-complaint"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-700 hover:border-primary-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  تقديم شكوى
                </Link>
                <Link
                  to="/track-complaint"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-700 hover:border-primary-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  تتبع شكوى
                </Link>
              </>
            )}

            {isAuthenticated && (
              <Link
                to="/admin/complaints"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-700 hover:border-primary-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                لوحة التحكم
              </Link>
            )}

            <Link
              to="/faq"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-700 hover:border-primary-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              الأسئلة الشائعة
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-right px-3 py-2 rounded-md text-base font-medium text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400"
              >
                تسجيل الخروج
              </button>
            ) : (
              <Link
                to="/login"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      </Transition>
    </nav>
  )
}

export default Navbar