'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Service {
  id: number
  category: string
  name: string
  price: number
  description: string
  status: string
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [allServices, setAllServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServices() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('status', '已上架')
          .order('sort_order', { ascending: true })

        if (error) throw error

        setAllServices(data || [])
      } catch (err) {
        console.error('加载服务数据失败:', err)
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const categories = ['全部', '护航保底', '赌约单', '趣味单', '摸红单', '保险单', '陪玩', '部门任务', '赛季3x3']

  const filteredServices = allServices.filter(
    s => selectedCategory === '全部' || s.category === selectedCategory
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero */}
      <section className="py-20 text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">服务项目</h1>
          <p className="text-xl text-gray-300">专业护航团队 · 多样化服务选择 · 透明价格</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <span className="ml-4 text-gray-400">加载服务数据中...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-red-400">❌ 加载失败: {error}</p>
            </div>
          )}

          {/* Services List */}
          {!loading && !error && (
            <>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="text-center mb-8">
            <p className="text-gray-400">
              当前显示 <strong className="text-purple-400">{filteredServices.length}</strong> 个服务项目
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid gap-4 max-w-6xl mx-auto">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all border border-gray-700"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full">
                        {service.category}
                      </span>
                      <h3 className="text-xl font-bold">{service.name}</h3>
                    </div>
                    {service.description && (
                      <p className="text-gray-400 text-sm">{service.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-400">¥{service.price}</div>
                    </div>
                    <a
                      href="https://work.weixin.qq.com/kfid/kfc48f3dea4d2ea29be"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all whitespace-nowrap"
                    >
                      立即下单
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center bg-gray-800/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">找不到您需要的服务？</h2>
          <p className="text-gray-400 mb-8">联系客服，我们可以为您定制专属服务方案</p>
          <a
            href="https://work.weixin.qq.com/kfid/kfc48f3dea4d2ea29be"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            联系客服
          </a>
        </div>
      </section>
    </div>
  )
}
