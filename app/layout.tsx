import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import ConditionalNavigation from '@/components/ConditionalNavigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "战一下电竞护航俱乐部 - 三角洲行动专业护航服务",
    template: "%s | 战一下电竞护航俱乐部"
  },
  description: "战一下电竞专业提供三角洲行动护航服务，包括赌约单、摸红单、趣味单、陪玩教学等。纯绿保障，7x24小时在线，专业打手团队，安全可靠。",
  keywords: ["三角洲行动", "三角洲护航", "战一下电竞", "游戏护航", "陪玩服务", "赌约单", "摸红单", "趣味单", "Delta Force", "电竞俱乐部", "纯绿护航", "组队护航"],
  authors: [{ name: "战一下电竞" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://zhan1x.com",
    siteName: "战一下电竞护航俱乐部",
    title: "战一下电竞护航俱乐部 - 三角洲行动专业护航服务",
    description: "专业三角洲行动护航服务，纯绿保障，安全可靠，7x24小时在线服务",
    images: [{
      url: "https://zhan1x.com/logo.png",
      width: 1200,
      height: 630,
      alt: "战一下电竞"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "战一下电竞护航俱乐部 - 三角洲行动专业护航服务",
    description: "专业三角洲行动护航服务，纯绿保障，安全可靠",
    images: ["https://zhan1x.com/logo.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    other: {
      'baidu-site-verification': 'your-baidu-verification-code',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`}
        </Script>
        {/* Baidu Analytics */}
        <Script id="baidu-analytics" strategy="afterInteractive">
          {`var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?${process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID}";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
          })();`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <ConditionalNavigation />
        {children}
      </body>
    </html>
  );
}
