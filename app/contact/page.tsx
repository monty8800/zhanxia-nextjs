import { Metadata } from 'next'
import { FaWeixin, FaClock, FaPhone } from 'react-icons/fa'
import { SiTiktok } from 'react-icons/si'

export const metadata: Metadata = {
  title: '联系我们',
  description: '战一下电竞联系方式，微信客服7x24小时在线，快速响应您的需求。提供微信、抖音等多种联系方式。三角洲行动护航服务咨询，随时为您解答。',
  keywords: ['战一下电竞客服', '联系方式', '微信客服', '在线咨询', '三角洲行动咨询', '7x24小时在线'],
  openGraph: {
    title: '联系我们 - 战一下电竞7x24小时在线客服',
    description: '微信客服7x24小时在线，快速响应您的需求',
    url: 'https://zhan1x.com/contact',
  },
}

const contactMethods = [
  {
    icon: FaWeixin,
    title: '微信客服',
    description: '企业微信客服',
    detail: '7x24小时在线响应',
    action: '点击咨询',
    link: 'https://work.weixin.qq.com/kfid/kfc48f3dea4d2ea29be',
    primary: true
  },
  {
    icon: SiTiktok,
    title: '抖音账号',
    description: '抖音号：72047935422',
    detail: '观看实战视频',
    action: '关注我们'
  },
  {
    icon: FaClock,
    title: '服务时间',
    description: '全年无休',
    detail: '7x24小时在线服务'
  }
]

const quickFaqs = [
  {
    q: '如何下单？',
    a: '微信搜索"战一下电竞"服务号 → 进入小程序 → 选择服务 → 支付费用 → 开始服务'
  },
  {
    q: '支付方式有哪些？',
    a: '小程序支持微信支付。重要：不接受私下转账，确保企业收款保障资金安全'
  },
  {
    q: '多久能开始服务？',
    a: '下单后系统自动分配打手，如超过5分钟未接单请联系客服'
  },
  {
    q: '账号安全有保障吗？',
    a: '100%纯绿服务，您自己登录账号，打手与您组队，已服务10000+客户零事故'
  }
]

const serviceInfo = [
  {
    icon: FaClock,
    title: '服务时间',
    description: '全年无休',
    highlight: '7×24小时在线'
  },
  {
    icon: FaPhone,
    title: '响应速度',
    description: '客服平均响应时间',
    highlight: '5-10分钟'
  },
  {
    icon: FaWeixin,
    title: '服务范围',
    description: '覆盖所有服务器',
    highlight: '全区全服'
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero */}
      <section className="py-20 text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">联系我们</h1>
          <p className="text-xl text-gray-300">7x24小时在线，随时为您服务</p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">联系方式</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <div
                  key={index}
                  className={`p-6 rounded-lg text-center ${
                    method.primary
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 border-2 border-purple-400'
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                >
                  <div className="text-5xl mb-4 flex justify-center">
                    <Icon />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                  <p className="text-gray-300 mb-2">{method.description}</p>
                  <p className="text-sm text-gray-400 mb-4">{method.detail}</p>
                  {method.link && (
                    <a
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-all"
                    >
                      {method.action}
                    </a>
                  )}
                  {method.action && !method.link && (
                    <span className="inline-block px-6 py-2 bg-gray-700 rounded-full text-sm">
                      {method.action}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick FAQ */}
      <section className="py-16 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">快速解答</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {quickFaqs.map((faq, index) => (
              <div key={index} className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-lg font-bold text-purple-400 mb-2">Q: {faq.q}</h3>
                <p className="text-gray-300">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {serviceInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <div key={index} className="text-center p-6 bg-gray-800 rounded-lg">
                  <div className="text-4xl mb-4 text-purple-400 flex justify-center">
                    <Icon />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{info.title}</h3>
                  <p className="text-gray-400 mb-2">{info.description}</p>
                  <p className="text-2xl font-bold text-purple-400">{info.highlight}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center bg-gray-800/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">还有疑问？</h2>
          <p className="text-gray-400 mb-8">立即联系我们的客服团队，获得专业解答</p>
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
