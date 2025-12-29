'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [tables, setTables] = useState<string[]>([])

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        
        // 测试连接
        const { data, error } = await supabase.from('services').select('count', { count: 'exact', head: true })
        
        if (error) {
          // 如果表不存在，这是正常的
          if (error.code === '42P01') {
            setStatus('success')
            setMessage('✅ Supabase 连接成功！数据库已连接，但还没有创建表。')
          } else {
            setStatus('error')
            setMessage(`❌ 连接错误: ${error.message}`)
          }
        } else {
          setStatus('success')
          setMessage('✅ Supabase 连接成功！数据库已就绪。')
        }
      } catch (err) {
        setStatus('error')
        setMessage(`❌ 连接失败: ${err instanceof Error ? err.message : '未知错误'}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Supabase 连接测试</h1>
        
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">连接状态</h2>
            {status === 'loading' && (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <span>正在测试连接...</span>
              </div>
            )}
            {status === 'success' && (
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                <p className="text-green-400">{message}</p>
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-400">{message}</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">配置信息</h2>
            <div className="bg-gray-900 rounded p-4 space-y-2 text-sm font-mono">
              <div>
                <span className="text-gray-400">URL:</span>{' '}
                <span className="text-purple-400">{process.env.NEXT_PUBLIC_SUPABASE_URL}</span>
              </div>
              <div>
                <span className="text-gray-400">Key:</span>{' '}
                <span className="text-purple-400">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h2 className="text-xl font-semibold mb-4">下一步</h2>
            <ul className="space-y-2 text-gray-300">
              <li>✅ Supabase 客户端配置完成</li>
              <li>✅ 环境变量已设置</li>
              <li>🔄 需要在 Supabase 后台创建数据表</li>
              <li>🔄 可以开始实现动态数据功能</li>
            </ul>
          </div>

          <div className="mt-6 flex gap-4">
            <a
              href="https://supabase.com/dashboard/project/kkfjnzdndotqhieeukuk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              打开 Supabase 控制台
            </a>
            <a
              href="/"
              className="px-6 py-2 bg-gray-700 rounded-full font-semibold hover:bg-gray-600 transition-all"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
