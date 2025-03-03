import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getComplaintById, updateComplaintStatus, addMessage, deleteComplaint } from '../../services/localStorageService'
import Modal from '../../components/Modal'

function ComplaintDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const loadComplaint = () => {
    try {
      const complaintData = getComplaintById(id)
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

  useEffect(() => {
    loadComplaint()
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

  const handleStatusChange = async (newStatus) => {
    try {
      const success = updateComplaintStatus(id, newStatus)
      if (success) {
        loadComplaint() // إعادة تحميل الشكوى لتحديث الرسائل والحالة
        toast.success('تم تحديث حالة الشكوى بنجاح')
      } else {
        toast.error('حدث خطأ أثناء تحديث الحالة')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('حدث خطأ غير متوقع')
    }
  }

  const handleAddMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const success = await addMessage(id, {
        text: newMessage,
        isAdmin: true
      })

      if (success) {
        setNewMessage('')
        loadComplaint() // إعادة تحميل الشكوى لتحديث الرسائل
        toast.success('تم إرسال الرد بنجاح')
      } else {
        toast.error('حدث خطأ أثناء إرسال الرد')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('حدث خطأ غير متوقع')
    }
  }

  const handleDelete = async () => {
    try {
      const success = deleteComplaint(id)
      if (success) {
        toast.success('تم حذف الشكوى بنجاح')
        navigate('/admin/complaints')
      } else {
        toast.error('حدث خطأ أثناء حذف الشكوى')
      }
    } catch (error) {
      console.error('Error deleting complaint:', error)
      toast.error('حدث خطأ غير متوقع')
    }
    setShowDeleteModal(false)
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

  return (
    <div className="container mx-auto px-4 py-8">
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium mb-4 text-dark-900 dark:text-dark-100">تأكيد الحذف</h3>
            <p className="text-dark-600 dark:text-dark-300 mb-6">
              هل أنت متأكد من أنك تريد حذف هذه الشكوى؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex justify-end space-x-4 rtl:space-x-reverse">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* رأس الصفحة */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/admin/complaints')}
            className="flex items-center px-4 py-2 text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            العودة لقائمة الشكاوى
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* تفاصيل الشكوى */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-800 shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-dark-900 dark:text-dark-100">
                      عنوان الشكوى:
                    </h3>
                    <h1 className="text-xl text-dark-900 dark:text-dark-100">
                      {complaint.title}
                    </h1>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-dark-500 dark:text-dark-400">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      النوع: {getComplaintTypeInArabic(complaint.type)}
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      تاريخ التقديم: {new Date(complaint.date).toLocaleDateString('en-GB')}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium text-dark-900 dark:text-dark-100">
                      تفاصيل الشكوى:
                    </h3>
                    <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                      <p className="text-dark-600 dark:text-dark-300 whitespace-pre-wrap">
                        {complaint.details}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* الحالة والإجراءات */}
          <div>
            <div className="bg-white dark:bg-dark-800 shadow rounded-lg p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    تحديث حالة الشكوى
                  </label>
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-dark-100"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  حذف الشكوى
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* قسم الرسائل */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 text-dark-900 dark:text-dark-100">المحادثة</h3>
          <div className="space-y-4">
            {complaint?.messages?.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`rounded-lg shadow px-4 py-3 max-w-lg w-full ${
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

          <form onSubmit={handleAddMessage} className="mt-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب ردك هنا..."
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
  )
}

export default ComplaintDetails