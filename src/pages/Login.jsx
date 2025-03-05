import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { supabase } from '../config/supabase'
import Modal from '../components/Modal'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) throw error

      // التحقق من دور المستخدم
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileError) throw profileError

      if (profileData.role === 'admin') {
        toast.success('تم تسجيل الدخول بنجاح')
        navigate('/admin/complaints')
      } else {
        await supabase.auth.signOut()
        throw new Error('غير مصرح لك بالدخول')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message === 'Invalid login credentials' 
        ? 'بيانات الدخول غير صحيحة' 
        : error.message || 'حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-800 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-dark-900 dark:text-dark-100 sm:text-5xl md:text-6xl">
            <span className="block">مرحباً بعودتك</span>
            <span className="block text-primary-600 dark:text-primary-500">تسجيل الدخول</span>
          </h1>
          <p className="mt-3 text-base text-dark-500 dark:text-dark-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
            قم بتسجيل الدخول للوصول إلى لوحة التحكم وإدارة الشكاوى
          </p>
        </div>

        <div className="bg-white dark:bg-dark-800 py-8 px-4 shadow-lg dark:shadow-dark-700 rounded-xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-700 dark:text-dark-300">
                البريد الإلكتروني
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-dark-100 sm:text-sm"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-700 dark:text-dark-300">
                كلمة المرور
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-dark-100 sm:text-sm"
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                >
                  {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="mr-2 block text-sm text-dark-700 dark:text-dark-300">
                  تذكرني
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </div>
          </form>

          
        </div>
      </div>

      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="نسيت كلمة المرور"
      >
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">👿</div>
          <p className="text-xl font-bold text-red-600 dark:text-red-500">
            تواصل مع الشتاير
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            لا تقلق، سنقوم بمساعدتك في استعادة كلمة المرور الخاصة بك
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default Login