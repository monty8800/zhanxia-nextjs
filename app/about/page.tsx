import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于我们',
  description: '战一下电竞护航俱乐部，专业的三角洲行动护航团队。派出职业打手与您组队进入对局，提供纯绿安全护航服务，7x24小时在线，实名认证保证金制度。10000+成功订单，99%客户满意度。',
  keywords: ['战一下电竞', '三角洲行动护航', '游戏护航', '职业选手', '组队服务', '安全护航', '电竞俱乐部', '纯绿保障', 'Delta Force'],
  openGraph: {
    title: '关于我们 - 战一下电竞护航俱乐部',
    description: '专业三角洲行动护航团队，10000+成功订单，99%客户满意度',
    url: 'https://zhan1x.com/about',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="py-20 text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">关于战一下电竞</h1>
          <p className="text-xl text-gray-300">专业、安全、高效的三角洲行动护航服务</p>
        </div>
      </section>

      {/* Company Intro */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">公司简介</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              战一下电竞护航俱乐部成立于2024年，是一家专注于三角洲行动游戏护航服务的专业团队。
              我们致力于为玩家提供安全、高效、专业的护航和陪玩服务。派出职业打手与您组队进入对局，帮助您安全撤离、获取高价值物资，轻松享受游戏乐趣。
            </p>
            <p>
              我们的团队由多名职业选手和资深游戏教练组成，拥有丰富的游戏经验和专业技能。
              通过严格的筛选和培训机制，确保每一位打手都能提供高质量的服务。
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">核心价值观</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-gray-800 rounded-lg text-center hover:bg-gray-750 transition-colors">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-3">纯绿保障</h3>
              <p className="text-gray-400">严格禁止使用任何外挂脚本，确保账号安全，所有服务纯手工完成</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg text-center hover:bg-gray-750 transition-colors">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">高效专业</h3>
              <p className="text-gray-400">职业选手团队，技术精湛，效率高，确保快速完成任务目标</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg text-center hover:bg-gray-750 transition-colors">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-3">诚信经营</h3>
              <p className="text-gray-400">明码标价，公开透明，不乱收费，保底机制确保客户权益</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg text-center hover:bg-gray-750 transition-colors">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">用户至上</h3>
              <p className="text-gray-400">7x24小时客服在线，随时响应客户需求，提供优质售后服务</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">团队实力</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-gray-400">专业打手</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-400 mb-2">10000+</div>
              <div className="text-gray-400">服务订单</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-400 mb-2">99%</div>
              <div className="text-gray-400">客户满意度</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-400">在线服务</div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-16 bg-gray-800/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">服务保障</h2>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start">
              <span className="text-green-400 mr-3 mt-1">✅</span>
              <span className="text-gray-300">实名认证 - 所有打手经过实名认证和技能考核</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 mt-1">✅</span>
              <span className="text-gray-300">保证金制度 - 打手缴纳保证金，确保服务质量</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 mt-1">✅</span>
              <span className="text-gray-300">安全保密 - 严格保护客户隐私和账号安全</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 mt-1">✅</span>
              <span className="text-gray-300">保底机制 - 明确保底标准，未达标全额退款</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 mt-1">✅</span>
              <span className="text-gray-300">售后无忧 - 7x24小时客服，随时解决问题</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 mt-1">✅</span>
              <span className="text-gray-300">价格透明 - 明码标价，无隐藏费用</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">选择我们，开启轻松游戏之旅</h2>
          <p className="text-gray-400 mb-8">专业团队，值得信赖</p>
          <a
            href="https://work.weixin.qq.com/kfid/kfc48f3dea4d2ea29be"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            立即咨询
          </a>
        </div>
      </section>
    </div>
  )
}
