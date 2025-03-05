-- إضافة عمود رقم التتبع
ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS tracking_number TEXT;

-- إنشاء دالة لتوليد رقم تتبع فريد
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tracking_number := CONCAT(
    TO_CHAR(CURRENT_DATE, 'YYMM'),
    LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء trigger لتوليد رقم التتبع تلقائياً
CREATE TRIGGER set_tracking_number
  BEFORE INSERT ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION generate_tracking_number(); 