-- =====================================================
-- 为服务表添加图片字段并配置 Supabase Storage
-- =====================================================

-- 1. 添加图片URL字段到 services 表
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. 创建存储桶的 SQL 说明
-- 注意：Storage Bucket 需要在 Supabase Dashboard 中手动创建
-- 或者使用 Supabase 客户端 SDK 创建

-- 存储桶配置说明：
-- 名称: service-images
-- 公开访问: true
-- 允许的文件类型: image/jpeg, image/png, image/webp, image/gif
-- 最大文件大小: 5MB

-- 3. Storage 策略（在创建存储桶后执行）
-- 这些策略需要在 Supabase Dashboard > Storage > service-images > Policies 中配置

-- 允许所有人查看图片
-- CREATE POLICY "Public Access" ON storage.objects
--   FOR SELECT USING (bucket_id = 'service-images');

-- 允许管理员上传图片
-- CREATE POLICY "Admin can upload images" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'service-images' AND
--     EXISTS (
--       SELECT 1 FROM user_profiles
--       WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
--     )
--   );

-- 允许管理员删除图片
-- CREATE POLICY "Admin can delete images" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'service-images' AND
--     EXISTS (
--       SELECT 1 FROM user_profiles
--       WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
--     )
--   );

-- 4. 验证
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'services' AND column_name = 'image_url';

SELECT '✅ 服务表已添加 image_url 字段！' as message;
SELECT '📝 请在 Supabase Dashboard 中创建 service-images 存储桶' as note;
