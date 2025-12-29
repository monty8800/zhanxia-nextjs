export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { FaBox, FaQuestionCircle, FaTrophy, FaComments } from 'react-icons/fa'

async function getDashboardStats() {
  const supabase = await createClient()

  const [services, faqs, cases, testimonials] = await Promise.all([
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('faqs').select('*', { count: 'exact', head: true }),
    supabase.from('cases').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
  ])

  return {
    services: services.count || 0,
    faqs: faqs.count || 0,
    cases: cases.count || 0,
    testimonials: testimonials.count || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    { label: '服务项目', value: stats.services, icon: FaBox, color: 'purple' },
    { label: '常见问题', value: stats.faqs, icon: FaQuestionCircle, color: 'blue' },
    { label: '成功案例', value: stats.cases, icon: FaTrophy, color: 'green' },
    { label: '客户评语', value: stats.testimonials, icon: FaComments, color: 'orange' },
  ]

  const colorClasses = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          欢迎回来！
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          这是战一下电竞管理后台，您可以在这里管理所有内容。
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg`}>
                  <Icon className="text-2xl text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          快速操作
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/services"
            className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-center"
          >
            <FaBox className="text-3xl text-purple-500 mx-auto mb-2" />
            <p className="font-semibold text-gray-800 dark:text-white">管理服务</p>
          </a>
          <a
            href="/admin/cases"
            className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 dark:hover:border-green-500 transition-colors text-center"
          >
            <FaTrophy className="text-3xl text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-gray-800 dark:text-white">管理案例</p>
          </a>
          <a
            href="/admin/faqs"
            className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-center"
          >
            <FaQuestionCircle className="text-3xl text-blue-500 mx-auto mb-2" />
            <p className="font-semibold text-gray-800 dark:text-white">管理FAQ</p>
          </a>
          <a
            href="/admin/testimonials"
            className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-500 dark:hover:border-orange-500 transition-colors text-center"
          >
            <FaComments className="text-3xl text-orange-500 mx-auto mb-2" />
            <p className="font-semibold text-gray-800 dark:text-white">管理评语</p>
          </a>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          系统信息
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">数据库状态</span>
            <span className="text-green-500 font-semibold">✓ 正常</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">API状态</span>
            <span className="text-green-500 font-semibold">✓ 正常</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">认证状态</span>
            <span className="text-green-500 font-semibold">✓ 已登录</span>
          </div>
        </div>
      </div>
    </div>
  )
}
