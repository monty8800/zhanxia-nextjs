-- =====================================================
-- 系统设置表
-- =====================================================
-- 存储站点全局配置信息
-- =====================================================

-- 创建系统设置表
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'text', -- text, number, boolean, json
  category VARCHAR(50) DEFAULT 'general', -- general, contact, seo, social
  description TEXT,
  is_public BOOLEAN DEFAULT false, -- 是否在前台公开显示
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入默认配置
INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
  -- 基本信息
  ('site_name', '战一下电竞', 'text', 'general', '网站名称', true),
  ('site_description', '专业的电竞服务平台', 'text', 'general', '网站描述', true),
  ('site_logo_url', '', 'text', 'general', '网站Logo URL', true),
  
  -- 联系方式
  ('contact_phone', '', 'text', 'contact', '联系电话', true),
  ('contact_email', '', 'text', 'contact', '联系邮箱', true),
  ('contact_wechat', '', 'text', 'contact', '微信号', true),
  ('contact_qq', '', 'text', 'contact', 'QQ号', true),
  ('contact_address', '', 'text', 'contact', '联系地址', true),
  
  -- 社交媒体
  ('social_douyin', '', 'text', 'social', '抖音号', true),
  ('social_wechat_service', '', 'text', 'social', '微信服务号', true),
  ('social_weibo', '', 'text', 'social', '微博账号', true),
  ('social_bilibili', '', 'text', 'social', 'B站账号', true),
  
  -- SEO设置
  ('seo_keywords', '电竞,游戏,代练,陪玩', 'text', 'seo', 'SEO关键词', false),
  ('seo_title', '战一下电竞 - 专业电竞服务平台', 'text', 'seo', 'SEO标题', false),
  ('seo_description', '提供专业的电竞服务，包括代练、陪玩、赛事等', 'text', 'seo', 'SEO描述', false),
  
  -- 业务设置
  ('business_hours', '9:00-22:00', 'text', 'general', '营业时间', true),
  ('service_announcement', '', 'text', 'general', '服务公告', true),
  ('is_maintenance', 'false', 'boolean', 'general', '维护模式', false)
ON CONFLICT (setting_key) DO NOTHING;

-- 创建 RLS 策略
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取公开设置
CREATE POLICY "Allow public read public settings" ON site_settings
  FOR SELECT
  USING (is_public = true);

-- 允许管理员读取所有设置
CREATE POLICY "Allow admin read all settings" ON site_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 允许管理员更新设置
CREATE POLICY "Allow admin update settings" ON site_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_site_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_timestamp
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_timestamp();

-- 验证查询
SELECT 
  setting_key,
  setting_value,
  category,
  is_public,
  description
FROM site_settings
ORDER BY category, setting_key;

SELECT '✅ 系统设置表创建完成！' as message;
