import React, { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    searchQuery: ''
  })

  useEffect(() => {
    const fetchComplaints = async () => {
      let query = supabase.from('complaints').select('*')

      // تطبيق الفلاتر
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority)
      }
      if (filters.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,details.ilike.%${filters.searchQuery}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching complaints:', error)
      } else {
        setComplaints(data)
      }
    }

    fetchComplaints()
  }, [filters]) // إعادة جلب البيانات عند تغيير الفلاتر

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <h1>لوحة التحكم</h1>
      <div>
        <label>الحالة:</label>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">الكل</option>
          <option value="جديدة">جديدة</option>
          <option value="قيد المراجعة">قيد المراجعة</option>
          <option value="مكتملة">مكتملة</option>
          <option value="مرفوضة">مرفوضة</option>
          <option value="معلقة">معلقة</option>
        </select>

        <label>النوع:</label>
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">الكل</option>
          <option value="نوع 1">نوع 1</option>
          <option value="نوع 2">نوع 2</option>
          {/* أضف المزيد من الأنواع حسب الحاجة */}
        </select>

        <label>الأولوية:</label>
        <select name="priority" value={filters.priority} onChange={handleFilterChange}>
          <option value="">الكل</option>
          <option value="عالية">عالية</option>
          <option value="متوسطة">متوسطة</option>
          <option value="منخفضة">منخفضة</option>
        </select>

        <input
          type="text"
          name="searchQuery"
          placeholder="ابحث في العنوان أو التفاصيل..."
          value={filters.searchQuery}
          onChange={handleFilterChange}
        />
      </div>

      <ul>
        {complaints.map((complaint) => (
          <li key={complaint.id}>{complaint.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default AdminComplaints 