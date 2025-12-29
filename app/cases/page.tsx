'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Metadata } from 'next'

interface Case {
  id: number
  customer_name: string
  service_name: string
  achievement: string
  comment: string
  rating: number
  case_date: string
  highlights: string[]
}

interface Testimonial {
  id: number
  content: string
  author: string
}

interface Stat {
  stat_label: string
  stat_value: string
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient()
        
        // 并行获取所有数据
        const [casesResult, testimonialsResult, statsResult] = await Promise.all([
          supabase
            .from('cases')
            .select('*')
            .eq('status', '已发布')
            .order('sort_order'),
          supabase
            .from('testimonials')
            .select('*')
            .eq('status', '已发布')
            .order('sort_order'),
          supabase
            .from('site_stats')
            .select('stat_label, stat_value')
            .order('display_order')
        ])

        if (casesResult.error) throw casesResult.error
        if (testimonialsResult.error) throw testimonialsResult.error
        if (statsResult.error) throw statsResult.error

        setCases(casesResult.data || [])
        setTestimonials(testimonialsResult.data || [])
        setStats(statsResult.data || [])
      } catch (err) {
        console.error('加载数据失败:', err)
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero */}
      <section className="py-20 text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">成功案例</h1>
          <p className="text-xl text-gray-300">真实客户，真实评价，用事实说话</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <span className="ml-4 text-gray-400">加载数据中...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-red-400">❌ 加载失败: {error}</p>
            </div>
          )}

          {/* Stats Grid */}
          {!loading && !error && (
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-800 rounded-lg">
                <div className="text-4xl font-bold text-purple-400 mb-2">{stat.stat_value}</div>
                <div className="text-gray-400">{stat.stat_label}</div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-16 bg-gray-800/30">
        <div className="container mx-auto px-4">
          {!loading && !error && (
          <>
          <h2 className="text-3xl font-bold mb-12 text-center">客户案例展示</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {cases.map((caseItem) => (
              <div key={caseItem.id} className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{caseItem.customer_name}</h3>
                    <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full">
                      {caseItem.service_name}
                    </span>
                  </div>
                  <div className="text-yellow-400 text-xl">
                    {'★'.repeat(caseItem.rating)}
                  </div>
                </div>
                
                <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded">
                  <span className="text-green-400 font-semibold">成果：</span>
                  <span className="text-green-300">{caseItem.achievement}</span>
                </div>

                <p className="text-gray-300 italic mb-4">"{caseItem.comment}"</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {caseItem.highlights.map((highlight, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-sm rounded">
                      ✓ {highlight}
                    </span>
                  ))}
                </div>

                <div className="text-gray-500 text-sm">{caseItem.case_date}</div>
              </div>
            ))}
          </div>
          </>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {!loading && !error && (
          <>
          <h2 className="text-3xl font-bold mb-12 text-center">更多客户评价</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-gray-800 rounded-lg border-l-4 border-purple-500">
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <p className="text-gray-500 text-sm">- {testimonial.author}</p>
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
          <h2 className="text-3xl font-bold mb-4">您也想拥有这样的体验？</h2>
          <p className="text-gray-400 mb-8">加入10000+满意客户的行列，立即体验专业护航服务</p>
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
