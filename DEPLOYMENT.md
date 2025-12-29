# Cloudflare Pages 部署指南

## 📋 前置准备

1. ✅ Cloudflare 账号
2. ✅ GitHub 仓库（代码已推送）
3. ✅ Supabase 项目配置

---

## 🚀 部署步骤

### 方法一：通过 Cloudflare Dashboard（推荐）

#### 1. 连接 GitHub

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择 **Pages** > **Create a project**
3. 点击 **Connect to Git**
4. 授权 GitHub 并选择仓库：`战一下电竞`

#### 2. 配置构建设置

```yaml
项目名称: zhanxia-website
生产分支: nextjs-supabase-refactor (或 main)
构建命令: cd website-next && npm install && npm run build
构建输出目录: website-next/out
根目录: / (保持默认)
Node.js 版本: 18 或更高
```

#### 3. 配置环境变量

在 **Settings** > **Environment variables** 中添加：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=<你的Supabase项目URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<你的Supabase匿名密钥>

# 统计配置
NEXT_PUBLIC_GTM_ID=<你的Google Tag Manager ID>
NEXT_PUBLIC_BAIDU_ANALYTICS_ID=your-baidu-id
```

#### 4. 部署

1. 点击 **Save and Deploy**
2. 等待构建完成（约 2-5 分钟）
3. 部署成功后会得到一个 `.pages.dev` 域名

---

### 方法二：通过 Wrangler CLI

#### 1. 安装 Wrangler

```bash
npm install -g wrangler
```

#### 2. 登录 Cloudflare

```bash
wrangler login
```

#### 3. 构建项目

```bash
cd website-next
npm install
npm run build
```

#### 4. 部署

```bash
npx wrangler pages deploy out --project-name=zhanxia-website
```

---

## ⚙️ 关键配置说明

### 1. next.config.ts 配置

```typescript
output: 'export'  // 静态导出模式
images: {
  unoptimized: true  // 禁用图片优化
}
```

### 2. 静态导出限制

**不支持的功能：**
- ❌ Server-Side Rendering (SSR)
- ❌ API Routes
- ❌ Image Optimization
- ❌ Internationalized Routing
- ❌ Middleware

**解决方案：**
- ✅ 使用客户端数据获取（Supabase Client）
- ✅ 使用外部 API（已有 Cloudflare Workers）
- ✅ 使用原生 `<img>` 标签
- ✅ 纯客户端路由

---

## 🔧 常见问题

### 1. 构建失败

**问题：** TypeScript 或 ESLint 错误

**解决：**
```typescript
// next.config.ts
eslint: {
  ignoreDuringBuilds: true
}
```

### 2. 环境变量无法访问

**问题：** 环境变量未生效

**解决：**
- 确保变量名以 `NEXT_PUBLIC_` 开头
- 在 Cloudflare Dashboard 中配置
- 重新部署触发更新

### 3. 图片无法显示

**问题：** Next.js Image 组件报错

**解决：**
- 使用原生 `<img>` 标签
- 或设置 `unoptimized: true`

### 4. 404 错误

**问题：** 刷新页面返回 404

**解决：**
- Cloudflare Pages 自动处理 SPA 路由
- 确保构建输出包含 `_redirects` 或 `404.html`

---

## 📊 部署后验证

### 1. 检查页面

- 首页：`https://zhanxia-website.pages.dev`
- 管理后台：`https://zhanxia-website.pages.dev/admin`
- 服务页面：`https://zhanxia-website.pages.dev/services`

### 2. 测试功能

- ✅ 页面加载
- ✅ Supabase 连接
- ✅ 图片显示
- ✅ 路由跳转
- ✅ 管理后台登录

### 3. 性能检查

```bash
# 使用 Lighthouse 测试
npx lighthouse https://zhanxia-website.pages.dev
```

---

## 🌐 自定义域名（可选）

### 1. 添加域名

1. 进入项目 **Settings** > **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入域名（如 `www.zhanxia.com`）
4. 按照提示配置 DNS 记录

### 2. DNS 配置

```
类型: CNAME
名称: www
值: zhanxia-website.pages.dev
```

### 3. 等待 DNS 生效

通常需要 5-60 分钟

---

## 🔄 自动部署

### Git 集成

- **生产环境：** 推送到主分支自动部署
- **预览环境：** PR 和其他分支自动创建预览

```bash
# 推送代码自动触发部署
git add .
git commit -m "Update website"
git push origin nextjs-supabase-refactor
```

---

## 📝 重要提醒

1. **环境变量安全**
   - 不要提交 `.env` 文件到 Git
   - 在 Cloudflare Dashboard 中配置敏感信息

2. **构建缓存**
   - Cloudflare Pages 会缓存 `node_modules`
   - 如需清除缓存，在 Dashboard 中触发重新部署

3. **流量限制**
   - 免费套餐：500 次构建/月，无带宽限制
   - 适合中小型项目

4. **监控和分析**
   - 在 Cloudflare Analytics 查看访问数据
   - 使用 Google Tag Manager 追踪用户行为

---

## 🎯 下一步

1. ✅ 推送代码到 GitHub
2. ✅ 在 Cloudflare 创建项目
3. ✅ 配置构建设置
4. ✅ 添加环境变量
5. ✅ 触发部署
6. ✅ 测试验证
7. 🔄 配置自定义域名（可选）

---

## 📚 参考链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js 静态导出](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Supabase 客户端](https://supabase.com/docs/reference/javascript/introduction)
