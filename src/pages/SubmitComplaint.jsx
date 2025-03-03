import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Modal from '../components/Modal'
import { addComplaint } from '../services/localStorageService'

function SubmitComplaint() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')

  const categories = [
    { id: 'ambulance', name: 'إسعاف' },
    { id: 'operations', name: 'عمليات' },
    { id: 'administrative', name: 'إدارية' },
    { id: 'evaluation', name: 'تقييم' },
    { id: 'logistics', name: 'لوجستيات' },
    { id: 'internal', name: 'ضمن المركز' },
    { id: 'suggestion', name: 'اقتراح' },
    { id: 'other', name: 'شيء آخر' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.title || !formData.description || !formData.category) {
        toast.error('الرجاء تعبئة جميع الحقول المطلوبة')
        return
      }

      const complaintId = await addComplaint({
        ...formData,
        status: 'جديدة',
        date: new Date().toLocaleString('ar'),
      })

      if (complaintId) {
        setTrackingNumber(complaintId)
        setShowModal(true)
        toast.success('تم تقديم الشكوى بنجاح')
        setFormData({
          title: '',
          description: '',
          category: '',
          priority: ''
        })
      } else {
        toast.error('حدث خطأ أثناء تقديم الشكوى')
      }
    } catch (error) {
      console.error('Error submitting complaint:', error)
      toast.error('حدث خطأ غير متوقع')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-dark-800 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-dark-900 dark:text-dark-100 sm:text-5xl md:text-6xl">
              <span className="block">تقديم شكوى جديدة</span>
              <span className="block text-primary-600 dark:text-primary-500">نحن هنا لمساعدتك</span>
            </h1>
            <p className="mt-3 text-base text-dark-500 dark:text-dark-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
              يمكنك تقديم شكواك بكل سهولة من خلال النموذج التالي. سنقوم بمراجعة شكواك والرد عليها في أقرب وقت ممكن.
            </p>
          </div>

          <div className="bg-white dark:bg-dark-800 py-8 px-4 shadow-lg dark:shadow-dark-700 rounded-xl sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-dark-700 dark:text-dark-300">
                  عنوان الشكوى
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-dark-100 sm:text-sm"
                    placeholder="أدخل عنوان الشكوى"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-dark-700 dark:text-dark-300 text-sm font-bold mb-2" htmlFor="category">
                  نوع الشكوى
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full sm:text-sm border-gray-300 dark:border-dark-600 rounded-md dark:bg-dark-700 dark:text-white"
                  required
                >
                  <option value="">اختر نوع الشكوى</option>
                  <option value="ambulance">إسعاف</option>
                  <option value="operations">عمليات</option>
                  <option value="administrative">إدارية</option>
                  <option value="evaluation">تقييم</option>
                  <option value="logistics">لوجستيات</option>
                  <option value="internal">ضمن المركز</option>
                  <option value="suggestion">اقتراح</option>
                  <option value="other">شيء آخر</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-dark-700 dark:text-dark-300 text-sm font-bold mb-2" htmlFor="priority">
                  الأولوية
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full sm:text-sm border-gray-300 dark:border-dark-600 rounded-md dark:bg-dark-700 dark:text-white"
                  required
                >
                  <option value="">اختر الأولوية</option>
                  <option value="عالية">عالية</option>
                  <option value="متوسطة">متوسطة</option>
                  <option value="منخفضة">منخفضة</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-dark-700 dark:text-dark-300">
                  تفاصيل الشكوى
                </label>
                <div className="mt-1">
                  <textarea
                    name="description"
                    id="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="اكتب تفاصيل شكواك هنا..."
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-dark-100 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between space-x-3 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'جاري التقديم...' : 'تقديم الشكوى'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
            <svg className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold leading-6 text-dark-900 dark:text-white mb-4">
            تم تقديم الشكوى بنجاح
          </h3>
          <div className="mt-2">
            <p className="text-sm text-dark-500 dark:text-dark-400 mb-4">
              رقم تتبع الشكوى الخاص بك هو:
            </p>
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-primary-50 dark:bg-primary-900/30 px-6 py-3 rounded-xl">
                <span className="text-2xl font-mono font-bold text-primary-600 dark:text-primary-400 select-all">
                  {trackingNumber}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(trackingNumber)
                    toast.success('تم نسخ رقم التتبع')
                  }}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm text-dark-500 dark:text-dark-400">
              يرجى الاحتفاظ برقم التتبع بشكل آمن، حيث أنه الطريقة الوحيدة لمتابعة شكواك
            </p>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6 flex justify-center gap-3">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm transition-colors duration-200"
            onClick={() => navigate('/track-complaint')}
          >
            تتبع الشكوى
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 dark:border-dark-600 shadow-sm px-6 py-2 bg-white dark:bg-dark-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm transition-colors duration-200"
            onClick={() => setShowModal(false)}
          >
            إغلاق
          </button>
        </div>
      </Modal>
    </>
  )
}

export default SubmitComplaint