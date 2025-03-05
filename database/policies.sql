-- تفعيل RLS على الجداول
alter table complaints enable row level security;
alter table messages enable row level security;

-- حذف السياسات القديمة
drop policy if exists "Anyone can view messages" on messages;
drop policy if exists "Anyone can create messages" on messages;
drop policy if exists "Anyone can update messages" on messages;
drop policy if exists "Anyone can create complaints" on complaints;
drop policy if exists "Anyone can view complaints" on complaints;

-- إضافة سياسات جديدة للشكاوى
create policy "Enable read access for all users" on complaints
    for select using (true);

create policy "Enable insert access for all users" on complaints
    for insert with check (true);

create policy "Enable update access for all users" on complaints
    for update using (true);

-- إضافة سياسات جديدة للرسائل
create policy "Enable read access for all users" on messages
    for select using (true);

create policy "Enable insert access for all users" on messages
    for insert with check (true);

create policy "Enable update access for all users" on messages
    for update using (true);

-- منح الصلاحيات للمستخدمين المجهولين
grant usage on schema public to anon;
grant all on complaints to anon;
grant all on messages to anon;
grant usage on all sequences in schema public to anon; 