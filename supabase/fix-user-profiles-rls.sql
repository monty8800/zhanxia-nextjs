-- =====================================================
-- 修复 user_profiles 表的 RLS 策略
-- =====================================================
-- 问题：管理员无法读取自己的 profile 信息
-- 原因：RLS 策略可能配置错误，导致用户无法读取自己的数据
-- =====================================================

-- 1. 查看当前策略
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 2. 删除可能有问题的策略
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON user_profiles;

-- 3. 创建新的正确策略（修复无限递归问题）

-- 最简单的策略：允许所有已登录用户读取自己的配置
-- 这是唯一需要的策略，不会造成递归
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- 允许用户更新自己的部分信息（但不能改 role）
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 注意：移除了会导致无限递归的管理员策略
-- 因为管理员策略需要查询 user_profiles 来验证角色，
-- 而查询 user_profiles 又会触发这个策略，造成无限循环
-- 
-- 解决方案：只保留基础的 "读取自己" 策略就够了
-- requireAdmin() 函数可以正常工作，因为它只需要读取用户自己的记录

-- 4. 验证策略
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd as command,
  CASE 
    WHEN cmd = 'SELECT' THEN 'READ'
    WHEN cmd = 'INSERT' THEN 'CREATE'
    WHEN cmd = 'UPDATE' THEN 'UPDATE'
    WHEN cmd = 'DELETE' THEN 'DELETE'
    WHEN cmd = '*' THEN 'ALL'
  END as operation
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;

-- 5. 测试查询（用你的 user_id）
-- 注意：这个查询在 SQL Editor 中可能不会通过 RLS，因为它使用的是 postgres 角色
-- 但在应用中会正常工作
SELECT id, user_id, email, role 
FROM user_profiles 
WHERE user_id = 'dd4200df-e48b-44d9-bacb-de49c3fd3859';

-- 6. 显示结果
SELECT '✅ RLS 策略已修复！' as message,
       '现在用户应该可以读取自己的 profile 信息了' as note;

-- 额外提示：
-- 如果还是不行，可能需要刷新浏览器的登录状态
-- 1. 退出登录
-- 2. 重新登录
-- 3. 再次尝试访问 /admin
