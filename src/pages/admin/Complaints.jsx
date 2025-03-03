import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAllComplaints, updateComplaintStatus, deleteComplaintById } from '../../services/localStorageService'

function AdminComplaints() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    dateRange: 'all',
    searchQuery: ''
  })
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [modalAction, setModalAction] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = () => {
    try {
      const allComplaints = getAllComplaints()
      setComplaints(allComplaints)
    } catch (error) {
      toast.error('حدث خطأ أثناء تحميل الشكاوى')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (complaintId, status) => {
    setSelectedComplaint(complaintId)
    setNewStatus(status)
    setModalAction('status')
    setShowConfirmModal(true)
  }

  const handleDeleteClick = (complaintId) => {
    setSelectedComplaint(complaintId)
    setModalAction('delete')
    setShowConfirmModal(true)
  }

  const handleConfirmAction = async () => {
    try {
      if (modalAction === 'status') {
        const success = updateComplaintStatus(selectedComplaint, newStatus)
        if (success) {
          toast.success('تم تحديث حالة الشكوى بنجاح')
          setComplaints(prevComplaints => 
            prevComplaints.map(c => 
              c.id === selectedComplaint ? { ...c, status: newStatus } : c
            )
          )
        } else {
          toast.error('حدث خطأ أثناء تحديث حالة الشكوى')
        }
      } else if (modalAction === 'delete') {
        const success = deleteComplaintById(selectedComplaint)
        if (success) {
          toast.success('تم حذف الشكوى بنجاح')
          setComplaints(prevComplaints => prevComplaints.filter(c => c.id !== selectedComplaint))
        } else {
          toast.error('حدث خطأ أثناء حذف الشكوى')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('حدث خطأ غير متوقع')
    }
    setShowConfirmModal(false)
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

  const getStats = () => {
    const today = new Date().toLocaleDateString('en-GB')
    return {
      total: complaints.length,
      new: complaints.filter(c => c.status === 'جديدة').length,
      todayComplaints: complaints.filter(c => c.date === today).length,
      byType: complaints.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1
        return acc
      }, {}),
      urgent: complaints.filter(c => c.priority === 'عالية').length
    }
  }

  const getFilteredComplaints = () => {
    return complaints.filter(complaint => {
      // تصفية حسب الحالة
      if (filters.status && complaint.status !== filters.status) return false
      
      // تصفية حسب النوع
      if (filters.type && complaint.type !== filters.type) return false
      
      // تصفية حسب الأولوية
      if (filters.priority && complaint.priority !== filters.priority) return false
      
      // تصفية حسب التاريخ
      if (filters.dateRange !== 'all') {
        const complaintDate = new Date(complaint.date)
        const today = new Date()
        const diffTime = Math.abs(today - complaintDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (filters.dateRange === 'today' && diffDays !== 0) return false
        if (filters.dateRange === 'week' && diffDays > 7) return false
        if (filters.dateRange === 'month' && diffDays > 30) return false
      }
      
      // البحث في النص
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const searchableFields = [
          complaint.title,
          complaint.description,
          complaint.id,
          complaint.name,
          complaint.email
        ]
        
        return searchableFields.some(field => 
          field && field.toLowerCase().includes(query)
        )
      }
      
      return true
    })
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const stats = getStats()
  const filteredComplaints = getFilteredComplaints()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-dark-500 dark:text-dark-400">جاري تحميل الشكاوى...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-dark-900 dark:text-dark-100">
              لوحة التحكم
            </h1>
            <p className="mt-2 text-lg text-dark-500 dark:text-dark-400">
              إدارة ومتابعة الشكاوى
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('isAuthenticated')
              localStorage.removeItem('userRole')
              navigate('/login')
              toast.success('تم تسجيل الخروج بنجاح')
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
          >
            تسجيل الخروج
          </button>
        </div>

        {/* لوحة الإحصائيات */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-dark-700 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-2">الشكاوى الجديدة</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.new}</p>
          </div>
          <div className="bg-white dark:bg-dark-700 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-2">شكاوى اليوم</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.todayComplaints}</p>
          </div>
          <div className="bg-white dark:bg-dark-700 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-2">الشكاوى العاجلة</h3>
            <p className="text-3xl font-bold text-red-600">{stats.urgent}</p>
          </div>
          <div className="bg-white dark:bg-dark-700 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-2">إجمالي الشكاوى</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.total}</p>
          </div>
        </div>

        {/* أدوات التصفية */}
        <div className="bg-white dark:bg-dark-700 rounded-lg shadow mb-8">
          <div className="p-6">
            <h2 className="text-lg font-medium text-dark-900 dark:text-white mb-4">تصفية وبحث</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  الحالة
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 dark:border-dark-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-800 dark:text-white sm:text-sm"
                >
                  <option value="">الكل</option>
                  <option value="جديدة">جديدة</option>
                  <option value="قيد المراجعة">قيد المراجعة</option>
                  <option value="مكتملة">مكتملة</option>
                  <option value="مرفوضة">مرفوضة</option>
                  <option value="معلقة">معلقة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  النوع
                </label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 dark:border-dark-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-800 dark:text-white sm:text-sm"
                >
                  <option value="">الكل</option>
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

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  الأولوية
                </label>
                <select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 dark:border-dark-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-800 dark:text-white sm:text-sm"
                >
                  <option value="">الكل</option>
                  <option value="عالية">عالية</option>
                  <option value="متوسطة">متوسطة</option>
                  <option value="منخفضة">منخفضة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  التاريخ
                </label>
                <select
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 dark:border-dark-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-800 dark:text-white sm:text-sm"
                >
                  <option value="all">الكل</option>
                  <option value="today">اليوم</option>
                  <option value="week">آخر أسبوع</option>
                  <option value="month">آخر شهر</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  بحث
                </label>
                <input
                  type="text"
                  name="searchQuery"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  placeholder="ابحث في العنوان أو التفاصيل..."
                  className="block w-full rounded-md border-gray-300 dark:border-dark-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-800 dark:text-white sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* قائمة الشكاوى */}
        <div className="bg-white dark:bg-dark-700 shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-dark-900 dark:text-white">
              الشكاوى ({filteredComplaints.length})
            </h2>
          </div>
          <div className="border-t border-gray-200 dark:border-dark-600">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
                <thead className="bg-gray-50 dark:bg-dark-800">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                      رقم الشكوى
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                      العنوان
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                      الأولوية
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-700 divide-y divide-gray-200 dark:divide-dark-600">
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-gray-50 dark:hover:bg-dark-600">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900 dark:text-white">
                        {complaint.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500 dark:text-dark-400">
                        {complaint.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500 dark:text-dark-400">
                        {complaint.type === 'ambulance' ? 'إسعاف' :
                         complaint.type === 'operations' ? 'عمليات' :
                         complaint.type === 'administrative' ? 'إدارية' :
                         complaint.type === 'evaluation' ? 'تقييم' :
                         complaint.type === 'logistics' ? 'لوجستيات' :
                         complaint.type === 'internal' ? 'ضمن المركز' :
                         complaint.type === 'suggestion' ? 'اقتراح' :
                         'شيء آخر'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${complaint.status === 'جديدة' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500' :
                          complaint.status === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' :
                          complaint.status === 'مكتملة' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' :
                          complaint.status === 'مرفوضة' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500' :
                          'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500'}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${complaint.priority === 'عالية' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500' :
                          complaint.priority === 'متوسطة' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' :
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'}`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500 dark:text-dark-400">
                        {complaint.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <button
                            onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                          >
                            <svg className="h-4 w-4 ml-1.5 rtl:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            عرض
                          </button>
                          <div className="relative">
                            <select
                              value={complaint.status}
                              onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                              className="block w-40 rounded-md border-gray-300 dark:border-dark-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-800 dark:text-white sm:text-sm transition-colors duration-200"
                            >
                              <option value="جديدة">جديدة</option>
                              <option value="قيد المراجعة">قيد المراجعة</option>
                              <option value="مكتملة">مكتملة</option>
                              <option value="مرفوضة">مرفوضة</option>
                              <option value="معلقة">معلقة</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteClick(complaint.id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            title="حذف الشكوى"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-dark-900 dark:text-white mb-4">
              {modalAction === 'status' ? 'تحديث حالة الشكوى' : 'حذف الشكوى'}
            </h2>
            <p className="text-sm text-dark-500 dark:text-dark-400 mb-4">
              {modalAction === 'status' ? 'هل أنت متأكد من تحديث حالة الشكوى؟' : 'هل أنت متأكد من حذف الشكوى؟'}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-dark-600 text-dark-500 dark:text-dark-400 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-dark-500 transition-colors duration-200"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-500 transition-colors duration-200"
              >
                {modalAction === 'status' ? 'تحديث' : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminComplaints