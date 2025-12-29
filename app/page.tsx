import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            战一下电竞护航俱乐部
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            三角洲行动专业护航服务 · 纯绿保障 · 7x24小时在线
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#services"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              查看服务
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border-2 border-purple-600 rounded-full font-semibold hover:bg-purple-600 transition-all"
            >
              立即咨询
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 py-16">
          <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">纯绿保障</h3>
            <p className="text-gray-400">100%手动操作，不使用任何外挂，零封号风险</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">组队护航</h3>
            <p className="text-gray-400">您自己的账号，专业打手与您组队进入对局</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">快速接单</h3>
            <p className="text-gray-400">7x24小时在线，5分钟内极速响应</p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16">
          <h2 className="text-3xl font-bold mb-4">准备开始您的护航之旅？</h2>
          <p className="text-gray-400 mb-8">微信搜索"战一下电竞"服务号，立即下单</p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            联系我们
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 战一下电竞护航俱乐部. All rights reserved.</p>
          <p className="mt-2">Next.js + Supabase 重构版本</p>
        </div>
      </footer>
    </div>
  );
}
