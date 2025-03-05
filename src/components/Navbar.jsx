import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import ThemeToggle from './ThemeToggle'
import { toast } from 'react-toastify'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/login')
      toast.success('تم تسجيل الخروج بنجاح')
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-900 shadow-lg backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
            
            {user ? (
              <>
                <Link 
                  to="/admin/complaints" 
                  className="px-3 py-2 text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
                >
                  لوحة التحكم
                </Link>
                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="bg-primary-600 text-white px-4 py-2 rounded"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </>
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

            <Link to="/faq" className="px-3 py-2 text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
              الأسئلة الشائعة
            </Link>

            {!user && (
              <Link to="/login" className="px-4 py-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                تسجيل الدخول
              </Link>
            )}
          </div>

          {/* Theme Toggle Icon */}
          <ThemeToggle className="mr-4" />

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:hover:bg-dark-700"
            >
              <span className="sr-only">فتح القائمة</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            الرئيسية
          </Link>
          
          {user ? (
            <>
              <Link
                to="/admin/complaints"
                className="block px-3 py-2 rounded-md text-base font-medium text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                لوحة التحكم
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-right px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link
                to="/submit-complaint"
                className="block px-3 py-2 rounded-md text-base font-medium text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                تقديم شكوى
              </Link>
              <Link
                to="/track-complaint"
                className="block px-3 py-2 rounded-md text-base font-medium text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                تتبع شكوى
              </Link>
            </>
          )}

          <Link
            to="/faq"
            className="block px-3 py-2 rounded-md text-base font-medium text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            الأسئلة الشائعة
          </Link>

          {!user && (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar