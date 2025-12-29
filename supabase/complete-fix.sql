-- =====================================================
-- 一次性完整修复脚本
-- =====================================================
-- 解决问题：
-- 1. 无限递归错误
-- 2. 用户配置不存在
-- 3. 无法访问管理后台
-- =====================================================

-- 步骤 1：禁用 RLS（临时）
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 步骤 2：删除所有现有策略（避免递归）
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON user_profiles;

-- 步骤 3：插入或更新用户配置（设置为管理员）
INSERT INTO user_profiles (user_id, email, display_name, role)
VALUES (
  'dd4200df-e48b-44d9-bacb-de49c3fd3859',
  'wm_8800@163.com',
  'wm_8800',
  'admin'
)
ON CONFLICT (user_id) DO UPDATE 
SET role = 'admin', 
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    updated_at = NOW();

-- 步骤 4：创建简单的 RLS 策略（不会递归）
-- 这是唯一需要的策略：允许用户读取自己的配置
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- 允许用户更新自己的配置
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 步骤 5：重新启用 RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 步骤 6：验证结果
SELECT '====== 验证结果 ======' as step;

-- 检查用户配置是否存在
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = 'dd4200df-e48b-44d9-bacb-de49c3fd3859'
    )
    THEN '✅ 用户配置已存在'
    ELSE '❌ 用户配置不存在'
  END as profile_status;

-- 显示用户信息
SELECT 
  user_id,
  email,
  display_name,
  role,
  created_at
FROM user_profiles 
WHERE user_id = 'dd4200df-e48b-44d9-bacb-de49c3fd3859';

-- 检查 RLS 策略
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as command,
  CASE 
    WHEN cmd = 'SELECT' THEN '✅ READ (读取)'
    WHEN cmd = 'UPDATE' THEN '✅ UPDATE (更新)'
    ELSE cmd
  END as operation
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;

-- 检查 RLS 是否启用
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'user_profiles';

SELECT '====== 完成！======' as step,
       '现在可以：' as action,
       '1. 刷新 /check-auth 页面' as step1,
       '2. 访问 /admin 管理后台' as step2;
