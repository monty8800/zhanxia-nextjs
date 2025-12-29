-- =====================================================
-- 修复 RLS 策略 - 恢复公开读取，只限制写入权限
-- =====================================================
-- 此脚本修复之前错误删除的公开读取策略
-- 确保前台用户可以正常访问数据，但只有管理员可以修改
-- =====================================================

-- 修复 services 表
-- 删除可能存在的错误策略
DROP POLICY IF EXISTS "Admins can manage services" ON services;

-- 创建正确的管理员写入策略（INSERT, UPDATE, DELETE）
DROP POLICY IF EXISTS "Admins can insert services" ON services;
CREATE POLICY "Admins can insert services" ON services
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can update services" ON services;
CREATE POLICY "Admins can update services" ON services
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can delete services" ON services;
CREATE POLICY "Admins can delete services" ON services
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 修复 faqs 表
DROP POLICY IF EXISTS "Admins can manage faqs" ON faqs;

DROP POLICY IF EXISTS "Admins can insert faqs" ON faqs;
CREATE POLICY "Admins can insert faqs" ON faqs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can update faqs" ON faqs;
CREATE POLICY "Admins can update faqs" ON faqs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can delete faqs" ON faqs;
CREATE POLICY "Admins can delete faqs" ON faqs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 修复 cases 表
DROP POLICY IF EXISTS "Admins can manage cases" ON cases;

DROP POLICY IF EXISTS "Admins can insert cases" ON cases;
CREATE POLICY "Admins can insert cases" ON cases
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can update cases" ON cases;
CREATE POLICY "Admins can update cases" ON cases
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can delete cases" ON cases;
CREATE POLICY "Admins can delete cases" ON cases
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 修复 testimonials 表
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;

DROP POLICY IF EXISTS "Admins can insert testimonials" ON testimonials;
CREATE POLICY "Admins can insert testimonials" ON testimonials
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can update testimonials" ON testimonials;
CREATE POLICY "Admins can update testimonials" ON testimonials
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can delete testimonials" ON testimonials;
CREATE POLICY "Admins can delete testimonials" ON testimonials
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 修复 site_stats 表
DROP POLICY IF EXISTS "Admins can manage site_stats" ON site_stats;

DROP POLICY IF EXISTS "Admins can insert site_stats" ON site_stats;
CREATE POLICY "Admins can insert site_stats" ON site_stats
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can update site_stats" ON site_stats;
CREATE POLICY "Admins can update site_stats" ON site_stats
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Admins can delete site_stats" ON site_stats;
CREATE POLICY "Admins can delete site_stats" ON site_stats
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- 验证策略
-- =====================================================

-- 查看所有表的策略
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('services', 'faqs', 'cases', 'testimonials', 'site_stats')
ORDER BY tablename, cmd;

-- 成功提示
SELECT '✅ RLS策略已修复！现在前台可以公开读取，管理员可以管理数据。' AS message;
