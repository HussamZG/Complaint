import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { supabase } from '../../config/supabase'
import { FaEye, FaTrash } from 'react-icons/fa'
import Modal from '../../components/Modal'

function AdminComplaints() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    searchQuery: ''
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [complaintToDelete, setComplaintToDelete] = useState(null)

  useEffect(() => {
    loadComplaints()
    
    // إعداد subscription للتحديثات المباشرة
    const subscription = supabase
      .channel('complaints-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'complaints'
      }, () => {
        loadComplaints()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  const loadComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          id,
          title,
          type,
          details,
          status,
          priority,
          created_at,
          messages (
            content,
            created_at,
            is_admin
          ),
          user_id
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComplaints(data)
    } catch (error) {
      console.error('Error loading complaints:', error)
      toast.error('حدث خطأ في تحميل الشكاوى')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: newStatus })
        .eq('id', complaintId)

      if (error) throw error
      toast.success('تم تحديث حالة الشكوى بنجاح')
    } catch (error) {
      toast.error('حدث خطأ في تحديث حالة الشكوى')
    }
  }

  const confirmDelete = (complaint) => {
    setComplaintToDelete(complaint)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirmed = async () => {
    if (!complaintToDelete) return

    try {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', complaintToDelete.id)

      if (error) throw error
      
      toast.success('تم حذف الشكوى بنجاح')
      loadComplaints()
    } catch (error) {
      console.error('Error deleting complaint:', error)
      toast.error('حدث خطأ في حذف الشكوى')
    } finally {
      setShowDeleteModal(false)
      setComplaintToDelete(null)
    }
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

  const getPriorityColor = (priority) => {
    const colors = {
      'عالية': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'متوسطة': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'منخفضة': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
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

  // تنسيق التاريخ بالميلادي
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // تنسيق رقم الشكوى
  const formatComplaintNumber = (id) => {
    if (!id) return 'غير متوفر'
    // تحويل UUID إلى تنسيق أقصر وأسهل للقراءة
    return `COMP-${id.slice(0, 8).toUpperCase()}`
  }

  // حساب عدد الردود
  const getResponsesCount = (messages) => {
    return messages?.filter(m => !m.is_system).length || 0
  }

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
        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 dark:border-dark-700 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                  <thead className="bg-gray-50 dark:bg-dark-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        رقم الشكوى
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        العنوان
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        النوع
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        الأولوية
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        الردود
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        تاريخ التقديم
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">إجراءات</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                    {complaints.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-mono font-medium text-primary-600 dark:text-primary-400">
                              {formatComplaintNumber(complaint.id)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {complaint.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                          <div className="flex flex-col">
                            <span>{complaint.title}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                              {complaint.details}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-dark-700">
                            {complaint.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-md ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <span className="px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                            {getResponsesCount(complaint.messages)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col">
                            <span>{formatDate(complaint.created_at)}</span>
                            <span className="text-xs opacity-75">
                              {new Date(complaint.created_at).toLocaleTimeString('ar-SA')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse">
                            <button
                              onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
                              className="flex items-center text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                              title="عرض التفاصيل"
                            >
                              <FaEye className="w-5 h-5" />
                              <span className="mr-2">عرض</span>
                            </button>
                            <button
                              onClick={() => confirmDelete(complaint)}
                              className="flex items-center text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                              title="حذف الشكوى"
                            >
                              <FaTrash className="w-4 h-4" />
                              <span className="mr-2">حذف</span>
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
      </div>

      {/* مودال تأكيد الحذف */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
              <FaTrash className="h-6 w-6 text-red-600 dark:text-red-500" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                تأكيد حذف الشكوى
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  هل أنت متأكد من حذف الشكوى "{complaintToDelete?.title}"؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              onClick={handleDeleteConfirmed}
            >
              حذف
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-dark-600 shadow-sm px-4 py-2 bg-white dark:bg-dark-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200"
              onClick={() => setShowDeleteModal(false)}
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminComplaints