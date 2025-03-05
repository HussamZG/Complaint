-- إنشاء جدول الشكاوى
create table complaints (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  type text not null,
  details text,
  status text default 'جديدة',
  priority text default 'متوسطة',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- إنشاء جدول الرسائل
create table messages (
  id uuid default uuid_generate_v4() primary key,
  complaint_id uuid references complaints(id) on delete cascade,
  content text not null,
  is_admin boolean default false,
  is_system boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- إنشاء trigger لتحديث updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

create trigger update_complaints_updated_at
  before update on complaints
  for each row
  execute procedure update_updated_at_column();

-- تحديث جدول الشكاوى
alter table complaints
  alter column user_id drop not null; -- جعل user_id اختياري

-- التأكد من وجود الأعمدة المطلوبة
alter table complaints
  add column if not exists title text not null,
  add column if not exists type text not null,
  add column if not exists details text,
  add column if not exists status text default 'جديدة',
  add column if not exists priority text default 'متوسطة'; 