import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 不使用静态导出，支持动态路由
  images: {
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
