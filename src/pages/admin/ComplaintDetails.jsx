import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { supabaseService } from '../../services/supabaseService'
import { supabase } from '../../config/supabase'
import Modal from '../../components/Modal'

function ComplaintDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const loadComplaint = async () => {
    try {
      const complaintData = await supabaseService.complaints.getById(id)
      if (complaintData) {
        setComplaint(complaintData)
      } else {
        toast.error('لم يتم العثور على الشكوى')
        navigate('/admin/complaints')
      }
    } catch (error) {
      console.error('Error loading complaint:', error)
      toast.error('حدث خطأ أثناء تحميل الشكوى')
      navigate('/admin/complaints')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await supabaseService.complaints.update(id, { status: newStatus })
      setComplaint(prev => ({ ...prev, status: newStatus }))
      toast.success('تم تحديث حالة الشكوى بنجاح')
      loadComplaint() // إعادة تحميل البيانات
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('حدث خطأ أثناء تحديث الحالة')
    }
  }

  const handleAddMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          complaint_id: id,
          content: newMessage,
          is_admin: true,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      // تحديث حالة الرسائل مباشرة
      setComplaint(prev => ({
        ...prev,
        messages: [...(prev.messages || []), data]
      }))
      
      setNewMessage('')
      toast.success('تمت إضافة الرد بنجاح')
    } catch (error) {
      console.error('Error adding message:', error)
      toast.error('حدث خطأ أثناء إضافة الرد')
    }
  }

  const handleDelete = async () => {
    try {
      await supabaseService.complaints.delete(id)
      toast.success('تم حذف الشكوى بنجاح')
      navigate('/admin/complaints')
    } catch (error) {
      console.error('Error deleting complaint:', error)
      toast.error('حدث خطأ أثناء حذف الشكوى')
    }
  }

  useEffect(() => {
    loadComplaint()

    // إعداد اشتراك realtime للرسائل
    const channel = supabase
      .channel(`complaint-${id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `complaint_id=eq.${id}`
      }, payload => {
        // تحديث الرسائل فقط إذا كانت الرسالة من المستخدم
        if (payload.new && !payload.new.is_admin) {
          setComplaint(prev => ({
            ...prev,
            messages: [...(prev.messages || []), payload.new]
          }))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!complaint) {
    return null
  }

  const getStatusColor = (status) => {
    const statusColors = {
      'جديدة': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
      'قيد المراجعة': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
      'مكتملة': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
      'مرفوضة': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
      'معلقة': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500'
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500'
  }

  const getComplaintTypeInArabic = (type) => {
    const types = {
      'ambulance': 'إسعاف',
      'operations': 'عمليات',
      'administrative': 'إدارية',
      'evaluation': 'تقييم',
      'logistics': 'لوجستيات',
      'internal': 'ضمن المركز',
      'suggestion': 'اقتراح',
      'other': 'شيء آخر'
    }
    return types[type] || type
  }

  const statusOptions = [
    { value: 'جديدة', label: 'جديدة' },
    { value: 'قيد المراجعة', label: 'قيد المراجعة' },
    { value: 'مكتملة', label: 'مكتملة' },
    { value: 'مرفوضة', label: 'مرفوضة' },
    { value: 'معلقة', label: 'معلقة' }
  ]

  // إضافة دالة تنسيق التاريخ
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-dark-800 shadow-lg rounded-lg overflow-hidden">
        {/* رأس الصفحة */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100">
              {complaint.title}
            </h2>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => navigate('/admin/complaints')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-dark-700 dark:text-dark-200 dark:hover:bg-dark-600"
              >
                عودة
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        </div>

        {/* تفاصيل الشكوى */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">النوع</p>
              <p className="font-medium text-dark-900 dark:text-dark-100">{getComplaintTypeInArabic(complaint.type)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">الأولوية</p>
              <p className="font-medium text-dark-900 dark:text-dark-100">{complaint.priority}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">الحالة</p>
              <select
                value={complaint.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-dark-100 sm:text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">التفاصيل</p>
            <p className="mt-1 text-dark-900 dark:text-dark-100">{complaint.details}</p>
          </div>
        </div>

        {/* الرسائل */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-medium text-dark-900 dark:text-dark-100 mb-4">الردود</h3>
          <div className="space-y-4">
            {complaint.messages?.map((message) => (
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
                    {message.is_admin ? 'الإدارة' : 'المستخدم'}
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

          {/* نموذج إضافة رد */}
          <form onSubmit={handleAddMessage} className="mt-4">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="أضف رداً..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-700 dark:border-dark-600 dark:text-dark-100"
              rows="3"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إرسال الرد
            </button>
          </form>
        </div>
      </div>

      {/* مودال تأكيد الحذف */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="تأكيد الحذف"
      >
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            هل أنت متأكد من حذف هذه الشكوى؟
          </p>
          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              نعم، احذف
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-dark-700 dark:text-dark-200 dark:hover:bg-dark-600"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ComplaintDetails