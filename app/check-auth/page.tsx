'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CheckAuthPage() {
  const [authData, setAuthData] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient()
        
        // 检查当前用户
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        setAuthData({ user, error: authError })

        if (user) {
          // 检查用户配置
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()
          
          setProfileData({ profile, error: profileError })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-8">认证状态检查</h1>

        {/* 认证状态 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">1. Supabase Auth 状态</h2>
          {authData?.user ? (
            <div className="space-y-2">
              <p className="text-green-400">✅ 已登录</p>
              <div className="bg-gray-900 p-4 rounded">
                <p><strong>用户ID:</strong> {authData.user.id}</p>
                <p><strong>邮箱:</strong> {authData.user.email}</p>
                <p><strong>创建时间:</strong> {new Date(authData.user.created_at).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-red-400">❌ 未登录</p>
              {authData?.error && (
                <p className="text-sm text-red-300 mt-2">错误: {authData.error.message}</p>
              )}
              <a href="/login" className="inline-block mt-4 px-4 py-2 bg-purple-600 rounded">
                去登录
              </a>
            </div>
          )}
        </div>

        {/* 用户配置状态 */}
        {authData?.user && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">2. User Profile 状态</h2>
            {profileData?.profile ? (
              <div className="space-y-2">
                <p className="text-green-400">✅ 配置存在</p>
                <div className="bg-gray-900 p-4 rounded">
                  <p><strong>角色 (role):</strong> 
                    <span className={`ml-2 px-2 py-1 rounded ${
                      profileData.profile.role === 'admin' 
                        ? 'bg-green-600' 
                        : 'bg-yellow-600'
                    }`}>
                      {profileData.profile.role}
                    </span>
                  </p>
                  <p><strong>显示名称:</strong> {profileData.profile.display_name || '未设置'}</p>
                  <p><strong>邮箱:</strong> {profileData.profile.email}</p>
                </div>
                
                {profileData.profile.role !== 'admin' && (
                  <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded">
                    <p className="text-yellow-400 font-bold">⚠️ 当前角色不是管理员</p>
                    <p className="text-sm mt-2">需要在 Supabase 中执行以下 SQL：</p>
                    <pre className="mt-2 p-3 bg-gray-900 rounded text-xs overflow-x-auto">
{`UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = '${authData.user.id}';`}
                    </pre>
                  </div>
                )}

                {profileData.profile.role === 'admin' && (
                  <div className="mt-4 p-4 bg-green-900/30 border border-green-500/50 rounded">
                    <p className="text-green-400 font-bold">✅ 是管理员，可以访问管理后台</p>
                    <a href="/admin" className="inline-block mt-2 px-4 py-2 bg-purple-600 rounded">
                      进入管理后台
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-red-400">❌ 用户配置不存在</p>
                {profileData?.error && (
                  <p className="text-sm text-red-300 mt-2">错误: {profileData.error.message}</p>
                )}
                <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded">
                  <p className="font-bold">问题：user_profiles 表中没有此用户的记录</p>
                  <p className="text-sm mt-2">可能原因：</p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>触发器未正确创建</li>
                    <li>用户注册时出错</li>
                    <li>需要手动插入记录</li>
                  </ul>
                  <p className="text-sm mt-4">手动创建记录的 SQL：</p>
                  <pre className="mt-2 p-3 bg-gray-900 rounded text-xs overflow-x-auto">
{`INSERT INTO user_profiles (user_id, email, display_name, role)
VALUES (
  '${authData.user.id}',
  '${authData.user.email}',
  '${authData.user.email?.split('@')[0]}',
  'admin'
)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 数据库表检查 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">3. 解决方案</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-bold text-purple-400 mb-2">方案 A：手动设置管理员权限（推荐）</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>复制上面的 SQL 语句</li>
                <li>访问 Supabase SQL Editor: 
                  <a href="https://supabase.com/dashboard/project/kkfjnzdndotqhieeukuk/sql/new" 
                     target="_blank" 
                     className="text-blue-400 underline ml-1">
                    打开
                  </a>
                </li>
                <li>执行 SQL 语句</li>
                <li>刷新此页面验证</li>
              </ol>
            </div>

            <div>
              <h3 className="font-bold text-purple-400 mb-2">方案 B：检查触发器</h3>
              <p className="ml-4">确保 add-auth-tables.sql 已完整执行，包括触发器部分</p>
            </div>
          </div>
        </div>

        {/* 链接 */}
        <div className="flex gap-4">
          <a href="/" className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
            返回首页
          </a>
          <a href="/login" className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">
            登录页面
          </a>
          {authData?.user && profileData?.profile?.role === 'admin' && (
            <a href="/admin" className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
              管理后台
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
