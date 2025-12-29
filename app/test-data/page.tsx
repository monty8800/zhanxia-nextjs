'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestDataPage() {
  const [results, setResults] = useState<any>({
    services: { count: 0, status: 'loading' },
    faqs: { count: 0, status: 'loading' },
    cases: { count: 0, status: 'loading' },
    testimonials: { count: 0, status: 'loading' },
    stats: { count: 0, status: 'loading' }
  })

  useEffect(() => {
    async function testAllTables() {
      const supabase = createClient()
      const newResults: any = {}

      // Test services
      try {
        const { data, error } = await supabase.from('services').select('*', { count: 'exact' })
        newResults.services = {
          count: data?.length || 0,
          status: error ? 'error' : 'success',
          error: error?.message
        }
      } catch (err) {
        newResults.services = { count: 0, status: 'error', error: String(err) }
      }

      // Test faqs
      try {
        const { data, error } = await supabase.from('faqs').select('*', { count: 'exact' })
        newResults.faqs = {
          count: data?.length || 0,
          status: error ? 'error' : 'success',
          error: error?.message
        }
      } catch (err) {
        newResults.faqs = { count: 0, status: 'error', error: String(err) }
      }

      // Test cases
      try {
        const { data, error } = await supabase.from('cases').select('*', { count: 'exact' })
        newResults.cases = {
          count: data?.length || 0,
          status: error ? 'error' : 'success',
          error: error?.message
        }
      } catch (err) {
        newResults.cases = { count: 0, status: 'error', error: String(err) }
      }

      // Test testimonials
      try {
        const { data, error } = await supabase.from('testimonials').select('*', { count: 'exact' })
        newResults.testimonials = {
          count: data?.length || 0,
          status: error ? 'error' : 'success',
          error: error?.message
        }
      } catch (err) {
        newResults.testimonials = { count: 0, status: 'error', error: String(err) }
      }

      // Test site_stats
      try {
        const { data, error } = await supabase.from('site_stats').select('*', { count: 'exact' })
        newResults.stats = {
          count: data?.length || 0,
          status: error ? 'error' : 'success',
          error: error?.message
        }
      } catch (err) {
        newResults.stats = { count: 0, status: 'error', error: String(err) }
      }

      setResults(newResults)
    }

    testAllTables()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'loading': return '⏳'
      default: return '❓'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-500 bg-green-900/20'
      case 'error': return 'border-red-500 bg-red-900/20'
      case 'loading': return 'border-yellow-500 bg-yellow-900/20'
      default: return 'border-gray-500 bg-gray-900/20'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          数据库连接测试
        </h1>

        <div className="grid gap-4">
          {/* Services */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(results.services.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Services (服务项目表)</h2>
              <span className="text-3xl">{getStatusIcon(results.services.status)}</span>
            </div>
            <p className="text-gray-300">
              记录数量: <strong className="text-purple-400">{results.services.count}</strong> 条
            </p>
            <p className="text-sm text-gray-400 mt-2">预期: 71条服务数据</p>
            {results.services.error && (
              <p className="text-red-400 mt-2 text-sm">错误: {results.services.error}</p>
            )}
          </div>

          {/* FAQs */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(results.faqs.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">FAQs (常见问题表)</h2>
              <span className="text-3xl">{getStatusIcon(results.faqs.status)}</span>
            </div>
            <p className="text-gray-300">
              记录数量: <strong className="text-purple-400">{results.faqs.count}</strong> 条
            </p>
            <p className="text-sm text-gray-400 mt-2">预期: 12条FAQ数据</p>
            {results.faqs.error && (
              <p className="text-red-400 mt-2 text-sm">错误: {results.faqs.error}</p>
            )}
          </div>

          {/* Cases */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(results.cases.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Cases (成功案例表)</h2>
              <span className="text-3xl">{getStatusIcon(results.cases.status)}</span>
            </div>
            <p className="text-gray-300">
              记录数量: <strong className="text-purple-400">{results.cases.count}</strong> 条
            </p>
            <p className="text-sm text-gray-400 mt-2">预期: 6条案例数据</p>
            {results.cases.error && (
              <p className="text-red-400 mt-2 text-sm">错误: {results.cases.error}</p>
            )}
          </div>

          {/* Testimonials */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(results.testimonials.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Testimonials (客户评语表)</h2>
              <span className="text-3xl">{getStatusIcon(results.testimonials.status)}</span>
            </div>
            <p className="text-gray-300">
              记录数量: <strong className="text-purple-400">{results.testimonials.count}</strong> 条
            </p>
            <p className="text-sm text-gray-400 mt-2">预期: 3条评语数据</p>
            {results.testimonials.error && (
              <p className="text-red-400 mt-2 text-sm">错误: {results.testimonials.error}</p>
            )}
          </div>

          {/* Site Stats */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(results.stats.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Site Stats (统计数据表)</h2>
              <span className="text-3xl">{getStatusIcon(results.stats.status)}</span>
            </div>
            <p className="text-gray-300">
              记录数量: <strong className="text-purple-400">{results.stats.count}</strong> 条
            </p>
            <p className="text-sm text-gray-400 mt-2">预期: 4条统计数据</p>
            {results.stats.error && (
              <p className="text-red-400 mt-2 text-sm">错误: {results.stats.error}</p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">测试摘要</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">成功的表:</p>
              <p className="text-2xl font-bold text-green-400">
                {Object.values(results).filter((r: any) => r.status === 'success').length} / 5
              </p>
            </div>
            <div>
              <p className="text-gray-400">总记录数:</p>
              <p className="text-2xl font-bold text-purple-400">
                {Object.values(results).reduce((sum: number, r: any) => sum + r.count, 0)} 条
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a href="/services" className="px-6 py-2 bg-purple-600 rounded-full hover:bg-purple-700 transition">
            查看服务页面
          </a>
          <a href="/faq" className="px-6 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition">
            查看FAQ页面
          </a>
          <a href="/cases" className="px-6 py-2 bg-green-600 rounded-full hover:bg-green-700 transition">
            查看案例页面
          </a>
          <a href="/" className="px-6 py-2 bg-gray-600 rounded-full hover:bg-gray-700 transition">
            返回首页
          </a>
        </div>
      </div>
    </div>
  )
}
