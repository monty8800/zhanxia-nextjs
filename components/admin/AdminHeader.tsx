'use client'

import { useState } from 'react'
import { signOutClient } from '@/lib/auth/client'
import { FaUser, FaSignOutAlt } from 'react-icons/fa'

interface AdminHeaderProps {
  user: {
    id: string
    email?: string
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSignOut = async () => {
    if (confirm('确定要退出登录吗？')) {
      await signOutClient()
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            管理后台
          </h2>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaUser className="text-gray-600 dark:text-gray-300" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {user.email || '管理员'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">管理员</p>
            </div>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FaSignOutAlt />
                  <span>退出登录</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
