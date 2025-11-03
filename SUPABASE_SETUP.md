# Hướng dẫn Setup Supabase cho Alliance Website

## Bước 1: Tạo Project Supabase

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Tạo project mới
3. Lưu lại **Project URL** và **anon/public key**

## Bước 2: Tạo Bảng Users trong Supabase

Chạy SQL sau trong SQL Editor của Supabase:

```sql
-- Tạo bảng profiles để lưu thông tin bổ sung
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Bước 3: Cấu hình Environment Variables

Cập nhật file `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Bước 4: Tạo User cho Test

Có 2 cách:

### Cách 1: Qua Supabase Dashboard

1. Vào **Authentication** → **Users**
2. Click **Add User**
3. Nhập email và password
4. User sẽ được tạo

### Cách 2: Qua SQL

```sql
-- Tạo user test (password: test123456)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('test123456', gen_salt('bf')),
  NOW(),
  '{"name": "Test User"}'::jsonb,
  NOW(),
  NOW()
);
```

## Bước 5: Test Login

1. Chạy `npm run dev`
2. Truy cập `/loginpage`
3. Đăng nhập bằng:
   - Email: test@example.com
   - Password: test123456

## Quản lý Users

### Tạo user mới cho member:

1. Vào Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Nhập email và password
4. Gửi thông tin cho member

### Xem danh sách users:

```sql
SELECT
  u.id,
  u.email,
  p.name,
  u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

### Xóa user:

1. Vào Dashboard → Authentication → Users
2. Click vào user cần xóa
3. Click "Delete User"

## Note

- **Quan trọng:** Giữ bí mật `NEXTAUTH_SECRET` và Supabase keys
- Không commit file `.env.local` vào Git
- Thêm `.env.local` vào `.gitignore`
- Khi deploy lên Vercel, nhớ thêm environment variables trong Project Settings

## Deploy lên Vercel

1. Push code lên GitHub
2. Import project vào Vercel
3. Thêm Environment Variables:

   - `NEXTAUTH_URL`: URL production của bạn
   - `NEXTAUTH_SECRET`: Secret key
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
   - `NEXT_PUBLIC_VIDEO_URL`: Cloudflare R2 URL

4. Deploy!
