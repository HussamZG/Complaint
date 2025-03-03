// القيم الافتراضية
const DEFAULT_COMPLAINTS = [
  {
    id: 'F7B2-9D4E-A1C8-E5F3',
    title: 'شكوى خدمات إسعاف',
    type: 'ambulance',
    details: 'تفاصيل الشكوى...',
    status: 'جديدة',
    date: '2024-03-01',
    priority: 'عالية',
    messages: [
      {
        content: 'تم استلام شكواك وسيتم مراجعتها',
        time: '10:30',
        isAdmin: true,
        date: '2024-03-01'
      }
    ]
  }
]

// تهيئة البيانات
const initializeData = () => {
  if (!localStorage.getItem('complaints')) {
    localStorage.setItem('complaints', JSON.stringify(DEFAULT_COMPLAINTS))
  }
}

// الحصول على جميع الشكاوى
export const getAllComplaints = () => {
  initializeData()
  return JSON.parse(localStorage.getItem('complaints'))
}

// الحصول على شكوى محددة
export const getComplaintById = (id) => {
  try {
    const complaints = getAllComplaints()
    const complaint = complaints.find(c => c.id === id)
    return complaint || null
  } catch (error) {
    console.error('Error getting complaint:', error)
    return null
  }
}

// إضافة شكوى جديدة
import { generateSecureId } from '../utils/idGenerator';
export const addComplaint = (complaintData) => {
  const complaints = getAllComplaints()
  const date = new Date()
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '/')

  const newComplaint = {
    id: generateSecureId(),
    title: complaintData.title,
    type: complaintData.category,
    details: complaintData.description,
    status: complaintData.status || 'جديدة',
    date: formattedDate,
    priority: complaintData.priority || 'متوسطة',
    messages: []
  }

  complaints.push(newComplaint)
  localStorage.setItem('complaints', JSON.stringify(complaints))
  return newComplaint.id
}

// إضافة رسالة لشكوى
export const addMessage = (complaintId, message) => {
  try {
    const complaints = getAllComplaints()
    const complaint = complaints.find(c => c.id === complaintId)
    
    if (complaint) {
      const now = new Date()
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })

      const formattedDate = now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      })

      // إذا لم تكن هناك رسائل، قم بإنشاء مصفوفة جديدة
      if (!complaint.messages) {
        complaint.messages = []
      }

      // إضافة الرسالة الجديدة
      const newMessage = {
        content: message.text, // استخدام نفس المفتاح للمحتوى
        date: formattedDate,
        time: formattedTime,
        isAdmin: message.isAdmin
      }

      complaint.messages.push(newMessage)
      localStorage.setItem('complaints', JSON.stringify(complaints))
      return true
    }
    return false
  } catch (error) {
    console.error('Error adding message:', error)
    return false
  }
}

// حذف شكوى
export const deleteComplaint = (id) => {
  try {
    const complaints = getAllComplaints()
    const updatedComplaints = complaints.filter(complaint => complaint.id !== id)
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints))
    return true
  } catch (error) {
    console.error('Error deleting complaint:', error)
    return false
  }
}

// تحديث حالة الشكوى
export const updateComplaintStatus = (complaintId, newStatus) => {
  try {
    const complaints = getAllComplaints()
    const complaintIndex = complaints.findIndex(c => c.id === complaintId)
    
    if (complaintIndex !== -1) {
      // تحديث الحالة
      complaints[complaintIndex].status = newStatus

      // إضافة رسالة نظام عن تغيير الحالة
      const now = new Date()
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })

      const formattedDate = now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      })

      if (!complaints[complaintIndex].messages) {
        complaints[complaintIndex].messages = []
      }

      complaints[complaintIndex].messages.push({
        content: `تم تحديث حالة الشكوى إلى: ${newStatus}`,
        date: formattedDate,
        time: formattedTime,
        isAdmin: true,
        isSystem: true
      })

      // حفظ التغييرات
      localStorage.setItem('complaints', JSON.stringify(complaints))
      return true
    }
    return false
  } catch (error) {
    console.error('Error updating complaint status:', error)
    return false
  }
}

// تحديث الشكوى
export const updateComplaint = (complaintId, updates) => {
  const complaints = getAllComplaints()
  const complaintIndex = complaints.findIndex(c => c.id === complaintId)
  
  if (complaintIndex !== -1) {
    complaints[complaintIndex] = {
      ...complaints[complaintIndex],
      ...updates
    }
    localStorage.setItem('complaints', JSON.stringify(complaints))
    return true
  }
  return false
}

// حذف شكوى محددة
export const deleteComplaintById = (id) => {
  try {
    let complaints = getAllComplaints()
    const filteredComplaints = complaints.filter(complaint => complaint.id !== id)
    localStorage.setItem('complaints', JSON.stringify(filteredComplaints))
    return true
  } catch (error) {
    console.error('Error deleting complaint:', error)
    return false
  }
}

// تنفيذ حذف الشكوى المحددة
const complaints = getAllComplaints()
const hasComplaint = complaints.some(c => c.id === '1739526292228')
if (hasComplaint) {
  deleteComplaintById('1739526292228')
  console.log('تم حذف الشكوى بنجاح')
}