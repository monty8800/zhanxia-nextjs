import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 静态导出模式，适合 Cloudflare Pages
  images: {
    unoptimized: true, // Cloudflare Pages 需要禁用图片优化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kkfjnzdndotqhieeukuk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
