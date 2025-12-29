'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface FAQ {
  id: number
  category: string
  question: string
  answer: string
  sort_order: number
}

interface GroupedFAQs {
  category: string
  questions: FAQ[]
}

export default function FAQPage() {
  const [groupedFaqs, setGroupedFaqs] = useState<GroupedFAQs[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .eq('status', '已发布')
          .order('category')
          .order('sort_order')

        if (error) throw error

        // 按分类分组
        const grouped = data.reduce((acc: GroupedFAQs[], faq: FAQ) => {
          const existingCategory = acc.find(g => g.category === faq.category)
          if (existingCategory) {
            existingCategory.questions.push(faq)
          } else {
            acc.push({
              category: faq.category,
              questions: [faq]
            })
          }
          return acc
        }, [])

        setGroupedFaqs(grouped)
      } catch (err) {
        console.error('加载FAQ数据失败:', err)
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  const toggleFAQ = (categoryIndex: number, questionIndex: number) => {
    const index = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero */}
      <section className="py-20 text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">常见问题</h1>
          <p className="text-xl text-gray-300">为您解答关于我们服务的各种疑问</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <span className="ml-4 text-gray-400">加载FAQ数据中...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6">
              <p className="text-red-400">❌ 加载失败: {error}</p>
            </div>
          )}

          {/* FAQ List */}
          {!loading && !error && groupedFaqs.map((category, catIndex) => (
            <div key={catIndex} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-purple-400">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((item, qIndex) => {
                  const index = `${catIndex}-${qIndex}`
                  const isOpen = openIndex === index
                  return (
                    <div
                      key={item.id}
                      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
                    >
                      <button
                        className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-750 transition-colors"
                        onClick={() => toggleFAQ(catIndex, qIndex)}
                      >
                        <h3 className="text-lg font-semibold pr-4">{item.question}</h3>
                        <span className="text-2xl text-purple-400 flex-shrink-0">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center bg-gray-800/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">还有其他问题？</h2>
          <p className="text-gray-400 mb-8">联系我们的客服团队，我们很乐意为您解答</p>
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
