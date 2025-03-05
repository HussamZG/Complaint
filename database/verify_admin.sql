-- التحقق من وجود المستخدم وإعداداته
do $$
declare
  v_user_id uuid;
  v_user_email text := 'reshe@sarc.com';
begin
  -- التحقق من وجود المستخدم
  select id into v_user_id
  from auth.users
  where email = v_user_email;

  if v_user_id is null then
    raise exception 'User not found: %', v_user_email;
  end if;

  -- طباعة معلومات المستخدم للتحقق
  raise notice 'User ID: %', v_user_id;
  
  -- التحقق من الملف الشخصي
  if not exists (
    select 1 from public.profiles
    where id = v_user_id and role = 'admin'
  ) then
    -- إنشاء أو تحديث الملف الشخصي
    insert into public.profiles (id, role)
    values (v_user_id, 'admin')
    on conflict (id) do update
    set role = 'admin';
    
    raise notice 'Profile updated for user: %', v_user_email;
  end if;

  -- تحديث حالة المستخدم في auth.users
  update auth.users
  set role = 'authenticated',
      email_confirmed_at = now()
  where id = v_user_id;

  raise notice 'User verification complete for: %', v_user_email;
end $$;

-- عرض معلومات المستخدم للتحقق
select 
  u.id,
  u.email,
  u.role as auth_role,
  u.email_confirmed_at,
  p.role as profile_role
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'reshe@sarc.com'; 