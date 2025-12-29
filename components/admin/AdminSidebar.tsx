'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaBox, FaQuestionCircle, FaTrophy, FaComments, FaChartBar, FaCog } from 'react-icons/fa'

const menuItems = [
  { href: '/admin', label: '仪表盘', icon: FaHome },
  { href: '/admin/services', label: '服务管理', icon: FaBox },
  { href: '/admin/cases', label: '案例管理', icon: FaTrophy },
  { href: '/admin/faqs', label: 'FAQ管理', icon: FaQuestionCircle },
  { href: '/admin/testimonials', label: '评语管理', icon: FaComments },
  { href: '/admin/stats', label: '统计数据', icon: FaChartBar },
  { href: '/admin/settings', label: '系统设置', icon: FaCog },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white shadow-lg z-10">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/admin">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            战一下电竞
          </h1>
          <p className="text-sm text-gray-400 mt-1">管理后台</p>
        </Link>
      </div>

      {/* Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <FaHome />
          <span>返回网站</span>
        </Link>
      </div>
    </aside>
  )
}
