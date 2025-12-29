'use client'

export const runtime = 'edge'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa'
import Link from 'next/link'

interface Case {
  id: number
  customer_name: string
  service_name: string
  achievement: string
  comment: string
  rating: number
  highlights: any
  status: string
  sort_order: number
}

export default function CasesManagePage() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('sort_order')

      if (error) throw error
      setCases(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确定要删除案例"${name}"吗？`)) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      alert('删除成功！')
      fetchCases()
    } catch (err) {
      alert('删除失败：' + (err instanceof Error ? err.message : '未知错误'))
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === '已发布' ? '草稿' : '已发布'
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('cases')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      fetchCases()
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">案例管理</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            共 {cases.length} 个案例，已发布 {cases.filter(c => c.status === '已发布').length} 个
          </p>
        </div>
        <Link
          href="/admin/cases/new"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <FaPlus />
          <span>添加案例</span>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {caseItem.customer_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {caseItem.service_name}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleStatus(caseItem.id, caseItem.status)}
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    caseItem.status === '已发布'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  {caseItem.status}
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < caseItem.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {caseItem.rating}.0
                </span>
              </div>

              {/* Achievement */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  成果：
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {caseItem.achievement}
                </p>
              </div>

              {/* Comment */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  评价：
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {caseItem.comment}
                </p>
              </div>

              {/* Highlights */}
              {caseItem.highlights && Array.isArray(caseItem.highlights) && (
                <div className="flex flex-wrap gap-2">
                  {caseItem.highlights.map((highlight: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href={`/admin/cases/${caseItem.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  <FaEdit />
                  <span>编辑</span>
                </Link>
                <button
                  onClick={() => handleDelete(caseItem.id, caseItem.customer_name)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                >
                  <FaTrash />
                  <span>删除</span>
                </button>
              </div>

              {/* Sort Order */}
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                排序: {caseItem.sort_order}
              </div>
            </div>
          </div>
        ))}
      </div>

      {cases.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          暂无案例数据
        </div>
      )}
    </div>
  )
}
