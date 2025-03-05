import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { supabase } from '../config/supabase'
import Chat from '../components/Chat'

function TrackComplaint() {
  const navigate = useNavigate()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [complaint, setComplaint] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return

    setIsLoading(true)
    try {
      const { data: complaint, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', trackingNumber)
        .single()

      if (error) throw error

      if (complaint) {
        setComplaint(complaint)
        // جلب الرسائل
        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('complaint_id', complaint.id)
          .order('created_at', { ascending: true })

        setMessages(messages || [])
      } else {
        toast.error('لم يتم العثور على الشكوى')
      }
    } catch (error) {
      console.error('Error searching complaint:', error)
      toast.error('حدث خطأ في البحث عن الشكوى')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let channel;
    
    const setupRealtimeSubscription = async () => {
      if (complaint?.id) {
        // إلغاء الاشتراك السابق إذا وجد
        if (channel) {
          await supabase.removeChannel(channel)
        }

        channel = supabase
          .channel(`complaint-${complaint.id}`)
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `complaint_id=eq.${complaint.id}`
          }, payload => {
            if (payload.new && payload.new.is_admin) {
              setMessages(prev => [...prev, payload.new])
            }
          })
          .subscribe()
      }
    }

    setupRealtimeSubscription()

    // تنظيف عند إزالة المكون
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [complaint?.id])

  const handleAddMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          complaint_id: complaint.id,
          content: newMessage,
          is_admin: false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      // تحديث الرسائل مباشرة
      setMessages(prev => [...prev, data])
      setNewMessage('')
      toast.success('تم إرسال الرسالة بنجاح')
    } catch (error) {
      toast.error('حدث خطأ في إرسال الرسالة')
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      time: date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
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
          <form onSubmit={handleSearch} className="space-y-6">
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
                    <div className="mt-2 text-sm text-dark-500 dark:text-dark-400">
                      <span>تاريخ التقديم: </span>
                      <time dateTime={complaint?.created_at}>
                        {formatDateTime(complaint?.created_at).date}
                      </time>
                    </div>
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
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 rounded-lg ${
                            message.is_admin
                              ? 'bg-primary-50 dark:bg-primary-900/20 mr-0 ml-12'
                              : 'bg-gray-50 dark:bg-dark-700 ml-0 mr-12'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-sm font-medium ${
                              message.is_admin 
                                ? 'text-primary-700 dark:text-primary-300'
                                : 'text-gray-600 dark:text-gray-300'
                            }`}>
                              {message.is_admin ? 'الإدارة' : 'أنت'}
                            </span>
                          </div>
                          <p className="text-gray-900 dark:text-gray-100">{message.content}</p>
                          <div className="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <time dateTime={message.created_at}>
                              {formatDateTime(message.created_at).date}
                            </time>
                            <time dateTime={message.created_at}>
                              {formatDateTime(message.created_at).time}
                            </time>
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