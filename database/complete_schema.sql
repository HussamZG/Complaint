-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('admin', 'user');
create type complaint_status as enum ('جديدة', 'قيد المراجعة', 'مكتملة', 'مرفوضة', 'معلقة');
create type complaint_priority as enum ('عالية', 'متوسطة', 'منخفضة');
create type complaint_type as enum (
  'إسعاف',
  'عمليات',
  'إدارية',
  'تقييم',
  'لوجستيات',
  'ضمن المركز',
  'اقتراح',
  'شيء آخر'
);

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create complaints table
create table public.complaints (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  type complaint_type not null,
  details text,
  status complaint_status default 'جديدة',
  priority complaint_priority default 'متوسطة',
  user_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  complaint_id uuid references public.complaints(id) on delete cascade,
  content text not null,
  is_admin boolean default false,
  is_system boolean default false,
  user_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers
create trigger set_complaints_updated_at
  before update on public.complaints
  for each row
  execute function public.handle_updated_at();

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Create RLS policies
alter table public.profiles enable row level security;
alter table public.complaints enable row level security;
alter table public.messages enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Complaints policies
create policy "Complaints are viewable by everyone"
  on public.complaints for select
  using (true);

create policy "Authenticated users can create complaints"
  on public.complaints for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update own complaints"
  on public.complaints for update
  using (auth.uid() = user_id);

create policy "Only admins can delete complaints"
  on public.complaints for delete
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- Messages policies
create policy "Messages are viewable by everyone"
  on public.messages for select
  using (true);

create policy "Authenticated users can create messages"
  on public.messages for insert
  with check (auth.role() = 'authenticated');

create policy "Only message owner or admin can update messages"
  on public.messages for update
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Grant permissions
grant usage on schema public to anon, authenticated;

-- Tables
grant select on public.profiles to anon, authenticated;
grant select, insert, update on public.complaints to authenticated;
grant select, insert, update on public.messages to authenticated;

-- Sequences
grant usage on all sequences in schema public to authenticated;

-- Create admin user function
create or replace function public.create_admin_user(email text, password text)
returns void as $$
declare
  user_id uuid;
begin
  -- Create user in auth.users
  user_id := (
    select id from auth.users
    where auth.users.email = create_admin_user.email
  );
  
  if user_id is null then
    insert into auth.users (email, encrypted_password, email_confirmed_at)
    values (email, crypt(password, gen_salt('bf')), now())
    returning id into user_id;
  end if;

  -- Update profile to admin
  update public.profiles
  set role = 'admin'
  where id = user_id;
end;
$$ language plpgsql security definer;