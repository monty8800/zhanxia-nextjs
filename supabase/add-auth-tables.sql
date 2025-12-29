-- =====================================================
-- 用户配置表 (User Profiles)
-- =====================================================

-- 创建用户配置表
CREATE TABLE IF NOT EXISTS user_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  avatar_url TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- 配置 RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 允许用户读取自己的配置
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- 允许用户更新自己的配置（除了 role）
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 允许管理员读取所有用户配置
CREATE POLICY "Admins can read all profiles" ON user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 允许管理员更新用户配置
CREATE POLICY "Admins can update profiles" ON user_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 自动创建用户配置的触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：当新用户注册时自动创建用户配置
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 插入默认管理员账号（请修改邮箱和创建对应用户）
-- 注意：需要先在 Supabase Auth 中创建该用户，然后运行以下语句
-- INSERT INTO user_profiles (user_id, email, display_name, role)
-- VALUES (
--   'YOUR_USER_ID',  -- 替换为实际的用户ID
--   'admin@zhan1x.com',
--   '系统管理员',
--   'admin'
-- )
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';


-- =====================================================
-- 操作日志表 (Admin Logs) - 可选
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50),
  record_id BIGINT,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON admin_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_table_name ON admin_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- 配置 RLS
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- 只允许管理员读取日志
CREATE POLICY "Admins can read logs" ON admin_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 系统自动插入日志（不需要用户权限）
CREATE POLICY "System can insert logs" ON admin_logs
  FOR INSERT
  WITH CHECK (true);


-- =====================================================
-- 更新现有表的 RLS 策略以支持管理员权限
-- 注意：保留公开读取策略，只添加管理员写入策略
-- =====================================================

-- 更新 services 表的策略
-- 保持公开读取策略不变："Allow public read access"
-- 添加管理员管理策略
DROP POLICY IF EXISTS "Allow authenticated users to manage services" ON services;
CREATE POLICY "Admins can insert services" ON services
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update services" ON services
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete services" ON services
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 更新 faqs 表的策略
-- 保持公开读取策略不变："Allow public read published faqs"
-- 添加管理员管理策略
DROP POLICY IF EXISTS "Allow authenticated users to manage faqs" ON faqs;
CREATE POLICY "Admins can insert faqs" ON faqs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update faqs" ON faqs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete faqs" ON faqs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 更新 cases 表的策略
-- 保持公开读取策略不变："Allow public read published cases"
-- 添加管理员管理策略
DROP POLICY IF EXISTS "Allow authenticated users to manage cases" ON cases;
CREATE POLICY "Admins can insert cases" ON cases
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update cases" ON cases
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete cases" ON cases
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 更新 testimonials 表的策略
-- 保持公开读取策略不变："Allow public read published testimonials"
-- 添加管理员管理策略
DROP POLICY IF EXISTS "Allow authenticated users to manage testimonials" ON testimonials;
CREATE POLICY "Admins can insert testimonials" ON testimonials
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update testimonials" ON testimonials
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete testimonials" ON testimonials
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 更新 site_stats 表的策略
-- 保持公开读取策略不变："Allow public read site_stats"
-- 添加管理员管理策略
DROP POLICY IF EXISTS "Allow authenticated users to manage site_stats" ON site_stats;
CREATE POLICY "Admins can insert site_stats" ON site_stats
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update site_stats" ON site_stats
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete site_stats" ON site_stats
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );


-- =====================================================
-- 完成！
-- =====================================================

COMMENT ON TABLE user_profiles IS '用户配置表';
COMMENT ON TABLE admin_logs IS '管理员操作日志表';

-- 使用说明：
-- 1. 执行此 SQL 脚本创建用户相关表
-- 2. 在 Supabase Auth Dashboard 中创建管理员用户
-- 3. 获取该用户的 ID（从 auth.users 表）
-- 4. 更新 user_profiles 表，设置该用户的 role 为 'admin'
-- 
-- 示例 SQL：
-- UPDATE user_profiles 
-- SET role = 'admin' 
-- WHERE email = 'your-admin@example.com';
