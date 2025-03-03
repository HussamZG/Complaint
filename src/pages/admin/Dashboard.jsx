import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllComplaints } from '../../services/localStorageService'

function Dashboard() {
  const [complaints, setComplaints] = useState([])

  useEffect(() => {
    const allComplaints = getAllComplaints()
    setComplaints(allComplaints)
  }, [])

  // حساب الإحصائيات من البيانات الفعلية
  const stats = {
    total: complaints.length,
    new: complaints.filter(c => c.status === 'جديدة').length,
    inProgress: complaints.filter(c => c.status === 'قيد المعالجة').length,
    resolved: complaints.filter(c => c.status === 'تم الحل').length
  }

  // الحصول على آخر 5 شكاوى
  const recentComplaints = complaints
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-dark-900 dark:text-white">لوحة التحكم</h1>
          <Link
            to="/admin/complaints"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            عرض جميع الشكاوى
          </Link>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="إجمالي الشكاوى"
            value={stats.total}
            icon={<DocumentIcon />}
            color="primary"
          />
          <StatCard
            title="شكاوى جديدة"
            value={stats.new}
            icon={<NewIcon />}
            color="yellow"
          />
          <StatCard
            title="قيد المعالجة"
            value={stats.inProgress}
            icon={<InProgressIcon />}
            color="blue"
          />
          <StatCard
            title="تم حلها"
            value={stats.resolved}
            icon={<ResolvedIcon />}
            color="green"
          />
        </div>

        {/* الشكاوى الحديثة */}
        <div className="mt-8">
          <div className="bg-white dark:bg-dark-800 shadow-soft rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-dark-200 dark:border-dark-700">
              <h3 className="text-lg leading-6 font-medium text-dark-900 dark:text-white">
                آخر الشكاوى المقدمة
              </h3>
            </div>
            {recentComplaints.length > 0 ? (
              <div className="divide-y divide-dark-200 dark:divide-dark-700">
                {recentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="px-4 py-4 sm:px-6 hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Link
                          to={`/admin/complaints/${complaint.id}`}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                        >
                          {complaint.type === 'corruption' ? 'فساد إداري' :
                           complaint.type === 'abuse' ? 'إساءة استخدام السلطة' :
                           complaint.type === 'discrimination' ? 'تمييز' :
                           complaint.type === 'harassment' ? 'تحرش' :
                           complaint.type === 'fraud' ? 'احتيال' : 'أخرى'}
                        </Link>
                        <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
                          رقم الشكوى: {complaint.id}
                        </p>
                      </div>
                      <div className="ml-6 flex items-center gap-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          complaint.status === 'جديدة'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : complaint.status === 'تم الحل'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                        }`}>
                          {complaint.status}
                        </span>
                        <span className="text-sm text-dark-500 dark:text-dark-400">
                          {new Date(complaint.date).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center text-dark-500 dark:text-dark-400">
                لا توجد شكاوى حتى الآن
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// مكون البطاقة الإحصائية
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white dark:bg-dark-800 overflow-hidden shadow-soft rounded-lg p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-md bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-dark-500 dark:text-dark-400 truncate">
              {title}
            </dt>
            <dd>
              <div className="text-lg font-medium text-dark-900 dark:text-white">
                {value}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}

// الأيقونات
const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const NewIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const InProgressIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ResolvedIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export default Dashboard 