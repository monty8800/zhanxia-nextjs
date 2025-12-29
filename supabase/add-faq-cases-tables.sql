-- =====================================================
-- 常见问题表 (FAQs)
-- =====================================================

-- 创建常见问题表
CREATE TABLE IF NOT EXISTS faqs (
  id BIGSERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT '已发布',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_status ON faqs(status);
CREATE INDEX IF NOT EXISTS idx_faqs_sort_order ON faqs(sort_order);

-- 插入常见问题数据
INSERT INTO faqs (category, question, answer, status, sort_order) VALUES
-- 服务相关
('服务相关', '你们的服务是否安全？会不会封号？', '我们承诺100%纯绿服务，严格禁止使用任何外挂脚本。所有服务都由真人打手手工完成，确保账号安全。我们已服务超过10000+客户，零封号记录。', '已发布', 1),
('服务相关', '服务费用如何计算？', '我们采用明码标价，每个服务都有明确的价格和保底标准。下单前会告知详细费用，无隐藏收费。支持多种支付方式，安全便捷。', '已发布', 2),
('服务相关', '什么是保底机制？', '保底机制是指我们承诺在服务过程中至少为您带出指定价值的物资。如果未达到保底标准，我们将全额退款或继续服务直到达标。', '已发布', 3),

-- 账号安全
('账号安全', '你们的服务是纯绿安全吗？', '绝对纯绿！我们俱乐部所有打手均为职业选手，不使用任何外挂、辅助软件，完全靠技术和经验进行游戏。100%手动操作，保证您的账号绝不会因为外挂问题被封号或追缴。', '已发布', 1),
('账号安全', '会被封号吗？', '不会。我们采用组队护航模式，您自己登录账号，打手与您组队进入对局。所有操作均为纯手动，无任何外挂行为，符合游戏规则，不存在封号风险。', '已发布', 2),
('账号安全', '打手能看到我的账号密码吗？', '完全不能。我们的护航服务不需要登录您的账号，打手只需知道您的游戏ID即可与您组队。您的账号密码、物资装备完全在自己掌控中。', '已发布', 3),

-- 服务流程
('服务流程', '如何下单？', '微信搜索"战一下电竞"服务号，点击下方"立即下单"按钮，进入小程序选择服务套餐并完成支付。支付成功后，系统会自动分配打手。', '已发布', 1),
('服务流程', '可以指定打手吗？', '可以。如果您之前使用过我们的服务，对某位打手满意，可以要求指定该打手为您服务。我们会尽量安排，但需视打手档期而定。', '已发布', 2),
('服务流程', '服务中途可以暂停吗？', '支持存单。如果您需要中途暂停服务，可以联系客服申请存单，但需要先完成当前正在进行的对局。', '已发布', 3),

-- 支付与退款
('支付与退款', '支持哪些支付方式？', '使用小程序在线下单，支持微信支付。重要提示：请不要私下转账给客服或任何工作人员，确保收款账户是企业收款。', '已发布', 1),
('支付与退款', '什么情况下可以退款？', '1) 未达到保底标准；2) 服务过程中出现账号安全问题（非客户原因）；3) 打手服务态度恶劣经核实属实。', '已发布', 2),
('支付与退款', '服务有售后期吗？', '有。默认订单完成后24小时内为售后期。如果在此期间内因我们的服务导致任何问题，我们将免费处理。', '已发布', 3);

-- 配置 RLS (Row Level Security)
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取已发布的FAQ
CREATE POLICY "Allow public read published faqs" ON faqs
  FOR SELECT
  USING (status = '已发布');

-- 允许认证用户管理FAQ（后台管理用）
CREATE POLICY "Allow authenticated users to manage faqs" ON faqs
  FOR ALL
  USING (auth.role() = 'authenticated');


-- =====================================================
-- 成功案例表 (Cases)
-- =====================================================

-- 创建成功案例表
CREATE TABLE IF NOT EXISTS cases (
  id BIGSERIAL PRIMARY KEY,
  customer_name VARCHAR(50) NOT NULL,
  service_name VARCHAR(200) NOT NULL,
  achievement VARCHAR(200) NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  case_date DATE NOT NULL,
  highlights JSONB,
  status VARCHAR(20) DEFAULT '已发布',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_rating ON cases(rating);
CREATE INDEX IF NOT EXISTS idx_cases_sort_order ON cases(sort_order);
CREATE INDEX IF NOT EXISTS idx_cases_date ON cases(case_date DESC);

-- 插入成功案例数据
INSERT INTO cases (customer_name, service_name, achievement, comment, rating, case_date, highlights, status, sort_order) VALUES
('张先生', '绝密护航3388W', '单局带出4200W', '打手技术过硬，全程指挥到位，超出保底很多，非常满意！下次还会再来。', 5, '2024-12-20', '["超额完成", "专业指挥", "效率高"]', '已发布', 1),
('李女士', '天命之子三阶段', '成功摸出9格红', '之前自己摸了好久都没出，找了战一下两把就出了，运气和技术都给力！', 5, '2024-12-18', '["快速出货", "服务态度好", "物超所值"]', '已发布', 2),
('王先生', '赌油单不出不结版', '3把出火箭燃料', '虽然价格贵点，但确实做到了不出不结，打手很有耐心，值得信赖。', 5, '2024-12-15', '["诚信经营", "耐心负责", "技术扎实"]', '已发布', 3),
('刘先生', 'S+双陪', '1小时18杀', '陪玩小哥技术真的强，教了很多实用技巧，自己玩也能用上，推荐！', 5, '2024-12-12', '["教学认真", "技术一流", "寓教于乐"]', '已发布', 4),
('陈女士', '刀皮收藏室困难模式', '成功集齐所有刀皮', '最难的模式都完成了，打手真的厉害！而且全程直播让我看，很放心。', 5, '2024-12-10', '["挑战成功", "透明服务", "专业可靠"]', '已发布', 5),
('赵先生', '猎护者加强版', '击杀5队护航', '原本只要求3队，结果打手给力多击杀了2队，体验拉满！', 5, '2024-12-08', '["超预期", "战斗力强", "服务超值"]', '已发布', 6);

-- 配置 RLS (Row Level Security)
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取已发布的案例
CREATE POLICY "Allow public read published cases" ON cases
  FOR SELECT
  USING (status = '已发布');

-- 允许认证用户管理案例（后台管理用）
CREATE POLICY "Allow authenticated users to manage cases" ON cases
  FOR ALL
  USING (auth.role() = 'authenticated');


-- =====================================================
-- 客户评语表 (Testimonials)
-- =====================================================

-- 创建客户评语表（用于展示更多简短评价）
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT '已发布',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON testimonials(sort_order);

-- 插入客户评语数据
INSERT INTO testimonials (content, author, status, sort_order) VALUES
('第一次找护航服务，很担心账号安全，结果服务完成后账号完好无损，物资也超出预期，以后就认准战一下了！', '游戏玩家 周先生', '已发布', 1),
('客服响应很快，打手很专业，全程都很顺利。价格虽然不便宜，但物有所值！', '上班族 孙女士', '已发布', 2),
('之前找过其他家，要么技术不行，要么态度不好。战一下的打手真的专业，服务态度也好，强烈推荐！', '学生 吴同学', '已发布', 3);

-- 配置 RLS (Row Level Security)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取已发布的评语
CREATE POLICY "Allow public read published testimonials" ON testimonials
  FOR SELECT
  USING (status = '已发布');

-- 允许认证用户管理评语（后台管理用）
CREATE POLICY "Allow authenticated users to manage testimonials" ON testimonials
  FOR ALL
  USING (auth.role() = 'authenticated');


-- =====================================================
-- 统计数据表 (Stats) - 可选
-- =====================================================

-- 创建统计数据表（用于管理首页和案例页的统计数字）
CREATE TABLE IF NOT EXISTS site_stats (
  id BIGSERIAL PRIMARY KEY,
  stat_key VARCHAR(50) UNIQUE NOT NULL,
  stat_label VARCHAR(100) NOT NULL,
  stat_value VARCHAR(50) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入统计数据
INSERT INTO site_stats (stat_key, stat_label, stat_value, display_order) VALUES
('total_orders', '累计服务订单', '10000+', 1),
('satisfaction_rate', '客户满意度', '99.8%', 2),
('positive_rate', '好评率', '99.5%', 3),
('repurchase_rate', '复购率', '85%', 4)
ON CONFLICT (stat_key) DO UPDATE
  SET stat_label = EXCLUDED.stat_label,
      stat_value = EXCLUDED.stat_value,
      display_order = EXCLUDED.display_order,
      updated_at = NOW();

-- 配置 RLS (Row Level Security)
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取统计数据
CREATE POLICY "Allow public read site_stats" ON site_stats
  FOR SELECT
  USING (true);

-- 允许认证用户管理统计数据（后台管理用）
CREATE POLICY "Allow authenticated users to manage site_stats" ON site_stats
  FOR ALL
  USING (auth.role() = 'authenticated');


-- =====================================================
-- 完成！
-- =====================================================

COMMENT ON TABLE faqs IS '常见问题表';
COMMENT ON TABLE cases IS '成功案例表';
COMMENT ON TABLE testimonials IS '客户评语表';
COMMENT ON TABLE site_stats IS '网站统计数据表';
