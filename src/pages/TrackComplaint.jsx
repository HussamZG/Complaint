import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Chat from '../components/Chat'
import { getComplaintById, addMessage } from '../services/localStorageService'
import { isValidComplaintId } from '../utils/idGenerator'

function TrackComplaint() {
  const navigate = useNavigate()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [complaint, setComplaint] = useState(null)
  const [complaintId, setComplaintId] = useState('')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  // إضافة مؤقت للتحديث التلقائي
  useEffect(() => {
    let interval
    if (complaintId) {
      interval = setInterval(() => {
        const updatedComplaint = getComplaintById(complaintId)
        if (updatedComplaint) {
          setComplaint(updatedComplaint)
          setMessages(updatedComplaint.messages || [])
        }
      }, 5000) // تحديث كل 5 ثواني
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [complaintId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!trackingNumber.trim()) {
      toast.error('الرجاء إدخال رقم التتبع')
      return
    }

    if (!isValidComplaintId(trackingNumber)) {
      toast.error('رقم التتبع غير صالح')
      return
    }

    setIsLoading(true)
    setComplaintId(trackingNumber)

    try {
      const foundComplaint = getComplaintById(trackingNumber)
      if (foundComplaint) {
        setComplaint(foundComplaint)
        setMessages(foundComplaint.messages || [])
        toast.success('تم العثور على الشكوى')
      } else {
        toast.error('لم يتم العثور على الشكوى')
        setComplaint(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Error loading complaint:', error)
      toast.error('حدث خطأ أثناء البحث عن الشكوى')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const success = await addMessage(complaint.id, {
        text: newMessage,
        isAdmin: false
      })

      if (success) {
        setNewMessage('')
        loadComplaint() // إعادة تحميل الشكوى لتحديث الرسائل
        toast.success('تم إرسال الرسالة بنجاح')
      } else {
        toast.error('حدث خطأ أثناء إرسال الرسالة')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('حدث خطأ غير متوقع')
    }
  }

  const loadComplaint = () => {
    if (!complaintId) return

    try {
      const complaintData = getComplaintById(complaintId)
      if (complaintData) {
        setComplaint(complaintData)
        setMessages(complaintData.messages || [])
      }
    } catch (error) {
      console.error('Error reloading complaint:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    const statusColors = {
      'قيد المراجعة': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
      'قيد المعالجة': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
      'تم الحل': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
      'مرفوضة': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
    }
    return statusColors[status] || statusColors['قيد المراجعة']
  }

  const getStatusText = (status) => {
    return status || 'قيد المراجعة'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/')
  }

  const getComplaintTypeInArabic = (type) => {
    const types = {
      'ambulance': 'إسعاف',
      'operations': 'عمليات',
      'administrative': 'إدارية',
      'evaluation': 'تقييم',
      'logistics': 'لوجستيات',
      'internal': 'ضمن المركز',
      'other': 'شيء آخر'
    }
    return types[type] || type
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-800 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-dark-900 dark:text-dark-100 sm:text-5xl md:text-6xl">
            <span className="block">تتبع شكواك</span>
            {complaint && (
              <span className={`inline-flex items-center px-3 py-1 mt-2 text-sm font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                {complaint.status || 'قيد المراجعة'}
              </span>
            )}
          </h1>
          <p className="mt-3 text-base text-dark-500 dark:text-dark-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
            أدخل رقم تتبع الشكوى الخاص بك لمعرفة حالتها والاطلاع على آخر التحديثات
          </p>
        </div>

        <div className="bg-white dark:bg-dark-800 py-8 px-4 shadow-lg dark:shadow-dark-700 rounded-xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="trackingNumber" className="block text-sm font-medium text-dark-700 dark:text-dark-300">
                رقم تتبع الشكوى
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="trackingNumber"
                  id="trackingNumber"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-dark-100 sm:text-sm"
                  placeholder="أدخل رقم تتبع الشكوى"
                />
              </div>
            </div>

            <div className="flex items-center justify-between space-x-3 rtl:space-x-reverse">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                العودة للرئيسية
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'جاري البحث...' : 'بحث'}
              </button>
            </div>
          </form>

          {complaint && (
            <div className="mt-8 space-y-6">
              <div className="border-t border-gray-200 dark:border-dark-600 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-dark-900 dark:text-dark-100">
                    {complaint.title}
                  </h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                    {getStatusText(complaint.status)}
                  </span>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-dark-500 dark:text-dark-400">
                      رقم التتبع
                    </p>
                    <p className="mt-1 text-sm text-dark-900 dark:text-dark-100">
                      {complaint.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-500 dark:text-dark-400">
                      نوع الشكوى
                    </p>
                    <p className="mt-1 text-sm text-dark-900 dark:text-dark-100 capitalize">
                      {getComplaintTypeInArabic(complaint.type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-500 dark:text-dark-400">
                      تاريخ التقديم
                    </p>
                    <p className="mt-1 text-sm text-dark-900 dark:text-dark-100">
                      {formatDate(complaint.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-500 dark:text-dark-400">
                      التفاصيل
                    </p>
                    <p className="mt-1 text-sm text-dark-900 dark:text-dark-100">
                      {complaint.details}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-dark-900 dark:text-dark-100">المحادثة</h3>
                    <div className="space-y-4">
                      {complaint.messages?.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
                        >
                          <div 
                            className={`rounded-lg shadow px-4 py-3 max-w-lg ${
                              message.isAdmin 
                                ? message.isSystem
                                  ? 'bg-gray-100 dark:bg-dark-600'
                                  : 'bg-white dark:bg-dark-700' 
                                : 'bg-primary-100 dark:bg-primary-900/30'
                            }`}
                          >
                            <p className={`${
                              message.isAdmin 
                                ? message.isSystem
                                  ? 'text-dark-600 dark:text-dark-400 text-sm'
                                  : 'text-dark-900 dark:text-dark-100' 
                                : 'text-dark-800 dark:text-dark-200'
                            }`}>
                              {message.content || message.text}
                            </p>
                            <div className="flex justify-between items-center mt-2 text-xs text-dark-500 dark:text-dark-400">
                              <span>{message.time}</span>
                              <span className="mr-2">{message.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <form onSubmit={handleAddMessage} className="mt-6">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="اكتب رسالتك هنا..."
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-dark-100"
                        />
                        <button
                          type="submit"
                          disabled={!newMessage.trim()}
                          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          إرسال
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TrackComplaint