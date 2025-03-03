// استيراد crypto-js للتشفير
import { SHA256 } from 'crypto-js';

/**
 * توليد معرف فريد وآمن للشكوى
 * يستخدم مزيجاً من الوقت والبيانات العشوائية والتشفير
 */
export const generateSecureId = () => {
  // إنشاء طابع زمني بدقة عالية
  const timestamp = new Date().getTime();
  
  // إنشاء رقم عشوائي
  const random = Math.random().toString(36).substring(2);
  
  // دمج البيانات مع بعضها
  const combinedData = `${timestamp}-${random}`;
  
  // تشفير البيانات باستخدام SHA-256
  const hash = SHA256(combinedData).toString();
  
  // أخذ جزء من الهاش (16 حرف) وتحويله إلى تنسيق أسهل للقراءة
  const shortHash = hash.substring(0, 16).toUpperCase();
  
  // تقسيم المعرف إلى مجموعات لسهولة القراءة
  const formattedId = `${shortHash.substring(0, 4)}-${shortHash.substring(4, 8)}-${shortHash.substring(8, 12)}-${shortHash.substring(12)}`;
  
  return formattedId;
};

/**
 * التحقق من صحة تنسيق المعرف
 */
export const isValidComplaintId = (id) => {
  // التحقق من تنسيق المعرف (XXXX-XXXX-XXXX-XXXX)
  const idPattern = /^[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/;
  return idPattern.test(id);
};
