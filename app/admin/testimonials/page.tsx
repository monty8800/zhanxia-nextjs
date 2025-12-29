'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FaPlus, FaEdit, FaTrash, FaQuoteLeft } from 'react-icons/fa'
import Link from 'next/link'

interface Testimonial {
  id: number
  content: string
  author: string
  status: string
  sort_order: number
}

export default function TestimonialsManagePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order')

      if (error) throw error
      setTestimonials(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, author: string) => {
    if (!confirm(`确定要删除"${author}"的评语吗？`)) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      alert('删除成功！')
      fetchTestimonials()
    } catch (err) {
      alert('删除失败：' + (err instanceof Error ? err.message : '未知错误'))
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === '已发布' ? '草稿' : '已发布'
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('testimonials')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      fetchTestimonials()
    } catch (err) {
      alert('更新状态失败：' + (err instanceof Error ? err.message : '未知错误'))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-4 text-gray-400">加载中...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">评语管理</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            共 {testimonials.length} 条评语，已发布 {testimonials.filter(t => t.status === '已发布').length} 条
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <FaPlus />
          <span>添加评语</span>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {/* Status Badge */}
              <div className="flex justify-between items-start">
                <FaQuoteLeft className="text-3xl text-purple-300 dark:text-purple-600" />
                <button
                  onClick={() => handleToggleStatus(testimonial.id, testimonial.status)}
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    testimonial.status === '已发布'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {testimonial.status}
                </button>
              </div>

              {/* Content */}
              <div>
                <p className="text-gray-700 dark:text-gray-300 italic line-clamp-4">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  — {testimonial.author}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/admin/testimonials/${testimonial.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  <FaEdit />
                  <span>编辑</span>
                </Link>
                <button
                  onClick={() => handleDelete(testimonial.id, testimonial.author)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                >
                  <FaTrash />
                  <span>删除</span>
                </button>
              </div>

              {/* Sort Order */}
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                排序: {testimonial.sort_order}
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          暂无评语数据
        </div>
      )}
    </div>
  )
}
